# Terraform Infrastructure Provisioning

This directory contains the Infrastructure-as-Code (IaC) configuration for deploying the Alumni Network Platform on AWS EC2, fulfilling the final DevOps Lab requirement.

## Prerequisites

1. **AWS CLI** installed and configured (`aws configure`).
2. **Terraform** installed on your local machine.
3. An **AWS Key Pair** named `alumni-prod-key` must exist in your selected AWS Region. (You can change the name in `variables.tf`).

## Architecture

The script provisions:
- An Amazon EC2 instance running Ubuntu 22.04 LTS (`t2.micro` by default for the AWS Free Tier limitations).
- A custom Security Group (`alumni_app_sg`) exposing ports:
    - `22` (SSH for management CLI override access)
    - `80` (HTTP for normal application routing paths)
    - `443` (HTTPS for SSL termination endpoints)
    - `5000` & `3000` (Dev testing node fallback sockets)
- A bash bootstrapper execution (`user_data` script) that natively updates Ubuntu OS streams and pre-installs the `docker` and `docker-compose-plugin` engines!

## Execution Steps

Run the following commands inside this `terraform/` directory:

1. **Initialize Terraform:**
   ```bash
   terraform init
   ```
   *This downloads the required AWS provider dependencies.*

2. **Validate Configurations:**
   ```bash
   terraform validate
   ```

3. **View Deployment Plan:**
   ```bash
   terraform plan
   ```
   *Review the resources that will be created.*

4. **Apply and Provision:**
   ```bash
   terraform apply --auto-approve
   ```
   *Watch it build your infrastructure automatically. Once done, it will output the `server_public_ip`.*

5. **Deploy the App via SSH:**
   SSH into the box and clone the repo to deploy via docker-compose:
   ```bash
   ssh -i /path/to/alumni-prod-key.pem ubuntu@<IP_FROM_OUTPUTS>
   git clone <YOUR_REPO_URL>
   cd alumni-network
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

6. **Tear down:**
   When finished grading, safely destroy all resources to avoid AWS billing:
   ```bash
   terraform destroy --auto-approve
   ```
