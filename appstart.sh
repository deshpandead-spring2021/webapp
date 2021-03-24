cd
pwd
cd webapp
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -c file:/home/ubuntu/webapp/cloudwatch-config.json \
    -s
ls -al
cd nodejs-webapp
pwd
# printenv
# pm2 start server.js
pm2 start node server.js -f