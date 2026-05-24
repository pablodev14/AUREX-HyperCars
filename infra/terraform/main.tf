provider "aws" {
  region = var.aws_region
}

locals {
  common_tags = {
    Project     = var.project_name
    Environment = "production"
    ManagedBy   = "terraform"
  }

  app_root    = abspath("${path.module}/../..")
  app_archive = "${path.module}/aurex-app.zip"
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_key_pair" "deployer" {
  key_name   = "${var.project_name}-key"
  public_key = file(pathexpand(var.public_key_path))

  tags = local.common_tags
}

resource "aws_security_group" "web" {
  name        = "${var.project_name}-sg"
  description = "Permite HTTP, API y SSH para AUREX"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "HTTP frontend"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Frontend docker compose"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Backend API opcional"
    from_port   = 4000
    to_port     = 4000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH administracion"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr]
  }

  egress {
    description = "Salida a internet"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.common_tags
}

resource "aws_instance" "app" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.instance_type
  subnet_id                   = data.aws_subnets.default.ids[0]
  associate_public_ip_address = true
  key_name                    = aws_key_pair.deployer.key_name
  vpc_security_group_ids      = [aws_security_group.web.id]
  user_data                   = templatefile("${path.module}/cloud-init.sh.tpl", {})

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-ec2"
  })
}

data "archive_file" "app" {
  type        = "zip"
  source_dir  = local.app_root
  output_path = local.app_archive

  excludes = [
    ".git",
    ".git/*",
    ".terraform",
    ".terraform/*",
    "backend/node_modules",
    "backend/node_modules/*",
    "frontend/node_modules",
    "frontend/node_modules/*",
    "frontend/dist",
    "frontend/dist/*",
    "infra/terraform/.terraform",
    "infra/terraform/.terraform/*",
    "infra/terraform/aurex-app.zip",
    "infra/terraform/terraform.tfstate",
    "infra/terraform/terraform.tfstate.backup",
    "infra/terraform/*.tfstate",
    "infra/terraform/*.tfstate.*",
    "*.pem",
    "*.key"
  ]
}

resource "null_resource" "deploy_app" {
  depends_on = [aws_instance.app]

  triggers = {
    instance_id = aws_instance.app.id
    app_hash    = data.archive_file.app.output_base64sha256
  }

  connection {
    type        = "ssh"
    host        = aws_instance.app.public_ip
    user        = "ubuntu"
    private_key = file(pathexpand(var.private_key_path))
    timeout     = "10m"
  }

  provisioner "file" {
    source      = data.archive_file.app.output_path
    destination = "/tmp/aurex-app.zip"
  }

  provisioner "remote-exec" {
    inline = [
      "cloud-init status --wait || true",
      "sudo mkdir -p /opt/aurex",
      "sudo rm -rf /opt/aurex/*",
      "sudo unzip -oq /tmp/aurex-app.zip -d /opt/aurex",
      "sudo chown -R ubuntu:ubuntu /opt/aurex",
      "cd /opt/aurex && sudo docker compose down || true",
      "cd /opt/aurex && sudo docker compose up -d --build",
      "cd /opt/aurex && sudo docker compose ps"
    ]
  }
}
