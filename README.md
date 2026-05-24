# AUREX Hypercars - Proyecto Telematica

Aplicacion web full stack para una marca ficticia de autos deportivos premium. El proyecto esta separado en **FRONTEND** y **BACKEND**, funciona con contenedores Docker y trae infraestructura como codigo para desplegar en AWS sobre una instancia EC2.

## Arquitectura

```text
Navegador
   |
   | http://IP:8080
   v
Frontend React + Vite + Nginx
   |
   | /api/*
   v
Backend Express REST API
```

- `frontend/`: React, Vite, CSS responsive, logo e imagenes originales de los vehiculos.
- `backend/`: API REST en Express con datos de marca, modelos, credito, acreditacion y concesionarios.
- `docker-compose.yml`: construye y ejecuta frontend + backend.
- `infra/terraform/`: crea EC2, grupo de seguridad, llave SSH, instala Docker y despliega la aplicacion.
- `scripts/`: scripts para desplegar o destruir la infraestructura con Terraform.

## Ejecutar en desarrollo local

Requisitos: Node.js 20 o superior.

```powershell
cd backend
npm install
npm run dev
```

En otra terminal:

```powershell
cd frontend
npm install
npm run dev
```

Abrir:

- Frontend: `http://localhost:5173`
- Backend healthcheck: `http://localhost:4000/api/health`
- API modelos: `http://localhost:4000/api/models`

## Ejecutar con Docker Compose

Requisitos: Docker Desktop o Docker Engine con Docker Compose plugin.

```powershell
docker compose up -d --build
docker compose ps
```

Abrir:

- Aplicacion: `http://localhost:8080`
- API: `http://localhost:4000/api/health`

Detener:

```powershell
docker compose down
```

## Endpoints del backend

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/health` | Estado del servicio |
| GET | `/api/brand` | Identidad de marca |
| GET | `/api/models` | Catalogo de autos y precios |
| GET | `/api/models/:id` | Detalle de un modelo |
| GET | `/api/financing` | Opciones de credito |
| GET | `/api/accreditations` | Acreditaciones y garantias |
| GET | `/api/dealers` | Concesionarios en Colombia |

## Despliegue automatico en AWS con Terraform

El despliegue de AWS esta automatizado. Terraform crea la infraestructura, instala Docker, comprime este proyecto, lo copia al EC2 y ejecuta `docker compose up -d --build`.

### Opcion rapida en Linux

Requisitos:

- AWS CLI configurado con credenciales de AWS Academy.
- Terraform instalado.
- OpenSSH instalado.

Desde la raiz del repositorio:

```bash
chmod +x scripts/terraform-deploy.sh
./scripts/terraform-deploy.sh
```

Si AWS Academy no permite `t3.small`, ejecuta:

```bash
./scripts/terraform-deploy.sh us-east-1 t2.micro
```

El script crea una llave SSH local si no existe, detecta tu IP publica, ejecuta `terraform init` y luego `terraform apply`. Al final imprime las URLs:

- Frontend: `http://IP_PUBLICA:8080`
- Backend: `http://IP_PUBLICA:4000/api/health`

### Opcion manual

Configura credenciales:

```bash
aws configure
```

Crea llave SSH:

```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/aurex-telematica -N "" -C "aurex-telematica"
chmod 400 ~/.ssh/aurex-telematica
```

Ejecuta Terraform:

```bash
cd infra/terraform
terraform init
terraform apply \
  -var "public_key_path=~/.ssh/aurex-telematica.pub" \
  -var "private_key_path=~/.ssh/aurex-telematica" \
  -var "allowed_ssh_cidr=TU_IP_PUBLICA/32"
```

Para saber tu IP publica:

```bash
curl https://checkip.amazonaws.com
```

### Recursos que crea Terraform

- EC2 Ubuntu en la region `us-east-1`.
- Security Group con puertos:
  - `22` SSH desde tu IP.
  - `80` HTTP opcional.
  - `8080` frontend publico.
  - `4000` backend publico para healthcheck.
- Key Pair de EC2 usando tu llave publica local.
- Instalacion automatica de Docker y Docker Compose plugin.
- Copia del proyecto a `/opt/aurex`.
- Ejecucion automatica de `docker compose up -d --build`.

### Comandos utiles en el servidor

Conectarse:

```bash
ssh -i ~/.ssh/aurex-telematica ubuntu@IP_PUBLICA_EC2
```

Ver contenedores:

```bash
cd /opt/aurex
docker compose ps
docker compose logs -f
```

Reiniciar:

```bash
docker compose restart
```

### Apagar y evitar costos

Cuando termines la entrega:

```bash
chmod +x scripts/terraform-destroy.sh
./scripts/terraform-destroy.sh
```

## Evidencias sugeridas para entregar

- Captura de `docker compose ps` en local o servidor.
- Captura de `http://IP_PUBLICA_EC2:8080`.
- Captura de `http://IP_PUBLICA_EC2:4000/api/health`.
- Captura de `terraform apply` con los outputs.
- Enlace al repositorio con `README.md`, `Dockerfile`, `docker-compose.yml` e `infra/terraform`.

## Notas academicas

- La marca, precios, acreditaciones y concesionarios son simulados para el proyecto.
- La aplicacion es consumible desde navegador y el backend esta separado por API REST.
- Los contenedores tienen politica `restart: unless-stopped` para mantenerse activos despues de reinicios del servidor.
- El frontend publica una SPA con Nginx y proxy `/api` hacia el backend.

## Fuentes oficiales utiles

- AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
- Configuracion de AWS CLI: https://docs.aws.amazon.com/cli/latest/reference/configure/
- Llaves SSH para EC2: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html
- Instalacion de Terraform: https://developer.hashicorp.com/terraform/intro/getting-started/install.html
- Docker Compose plugin: https://docs.docker.com/compose/install/linux/
