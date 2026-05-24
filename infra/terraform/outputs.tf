output "public_ip" {
  description = "IP publica del servidor EC2."
  value       = aws_instance.app.public_ip
}

output "frontend_url" {
  description = "URL publica del frontend publicado por Docker Compose."
  value       = "http://${aws_instance.app.public_ip}:8080"
}

output "backend_health_url" {
  description = "Endpoint de healthcheck del backend."
  value       = "http://${aws_instance.app.public_ip}:4000/api/health"
}

output "ssh_command" {
  description = "Comando SSH para conectarse al servidor."
  value       = "ssh -i ${var.private_key_path} ubuntu@${aws_instance.app.public_ip}"
}

output "deployment_note" {
  description = "Resumen del despliegue automatico."
  value       = "Terraform creo EC2, copio el proyecto a /opt/aurex y ejecuto docker compose up -d --build."
}
