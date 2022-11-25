#!/bin/bash
sudo -u ubuntu -i <<'EOF'

sudo apt-get update -y

sudo apt-get install -y \
gnupg-agent \
 
sudo apt-get remove -y docker docker-engine docker.io containerd runc

sudo mkdir -p /etc/apt/keyrings

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  
sudo apt-get update -y

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin docker-compose -y

sudo usermod -aG docker ubuntu

sudo apt remove -y nodejs npm

npm install --global yarn

npm install pm2@latest -g

EOF
