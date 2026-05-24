variable "aws_region" {
  description = "Region de AWS donde se desplegara el servidor."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Nombre base para recursos de AWS."
  type        = string
  default     = "aurex-telematica"
}

variable "instance_type" {
  description = "Tipo de instancia EC2."
  type        = string
  default     = "t3.small"
}

variable "public_key_path" {
  description = "Ruta local de la llave publica SSH que Terraform registrara en EC2."
  type        = string
  default     = "~/.ssh/aurex-telematica.pub"
}

variable "private_key_path" {
  description = "Ruta local de la llave privada SSH usada por Terraform para copiar y arrancar la aplicacion."
  type        = string
  default     = "~/.ssh/aurex-telematica"
}

variable "allowed_ssh_cidr" {
  description = "CIDR autorizado para SSH. Reemplazar por tu IP publica con /32."
  type        = string
  default     = "0.0.0.0/0"
}
