# Data source to fetch the latest Ubuntu 22.04 AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical owner ID

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Create a Security Group for the application
resource "aws_security_group" "alumni_sg" {
  name        = "alumni_app_sg"
  description = "Security group for Alumni Network MERN app"

  # SSH access from anywhere (Restrict in production)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP access for the Frontend / Reverse Proxy
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS access for secure traffic
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Development Backend API port
  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Development Frontend port
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound rule allowing all traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "alumni_app_sg"
  }
}

# Key Pair resource (You must generate this locally first: ssh-keygen -t rsa -b 2048 -f ~/.ssh/alumni-prod-key)
# For the DevOps lab, we'll assume the key is created in AWS Console or inject via variable, here we just define it logically mapping.

# Provision the EC2 Instance
resource "aws_instance" "app_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  key_name      = var.key_name

  vpc_security_group_ids = [aws_security_group.alumni_sg.id]

  # User data script to bootstrap the server with Docker & Git
  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update -y
              sudo apt-get install -y git curl unzip
              
              # Install Docker
              curl -fsSL https://get.docker.com -o get-docker.sh
              sudo sh get-docker.sh
              sudo usermod -aG docker ubuntu
              
              # Install Docker Compose plugin
              sudo apt-get update
              sudo apt-get install -y docker-compose-plugin
              
              # Start docker service
              sudo systemctl enable docker
              sudo systemctl start docker

              echo "Bootstrap sequence completed."
              EOF

  tags = {
    Name = "Alumni-Production-Server"
    Environment = "Prod"
    Project = "DevOpsLab"
  }
}
