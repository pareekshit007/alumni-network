#!/bin/bash
# MongoDB Disaster Recovery & Backup Script
# Satisfies DevOps Requirement extending persistent Volume mappings

BACKUP_DIR="./db_backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
CONTAINER_NAME="alumni-mongo"
DB_NAME="alumni_db"
DB_USER="admin"
DB_PASS="adminpassword"

echo "======================================"
echo "Initializing Database Backup Subroutine..."
echo "======================================"

# Ensure backup local mounting directory exists
mkdir -p "$BACKUP_DIR"

# Execute mongodump natively executing inside running docker cluster targeting raw database buffer streams into compressed zip blocks
echo "Extracting root byte dump from target proxy id: $CONTAINER_NAME ..."
docker exec $CONTAINER_NAME mongodump \
  --username $DB_USER \
  --password $DB_PASS \
  --authenticationDatabase admin \
  --db $DB_NAME \
  --archive --gzip > "$BACKUP_DIR/backup_${DB_NAME}_${TIMESTAMP}.gz"

if [ $? -eq 0 ]; then
    echo "Bytecode extraction valid. File secured to:"
    echo "$BACKUP_DIR/backup_${DB_NAME}_${TIMESTAMP}.gz"
else
    echo "Mux fault. Backup unverified!"
    exit 1
fi

# Cleanup old backups preserving top 5 blocks natively
echo "Executing legacy prune subroutine..."
ls -t $BACKUP_DIR/*.gz 2>/dev/null | tail -n +6 | xargs -r rm --

echo "======================================"
echo "Backup Operations Fully Complete."
echo "======================================"
