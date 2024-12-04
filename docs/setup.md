# Config

Setup a `.env` file in base folder with variable
`DATABASE_URL="{user, i.e. postgres}:{password}@localhost:{port, i.e. 5432}/{db name, i.e. postgres}?schema=public"`

If you want to connect to a server, replace localhost with server address and change db name as needed.
For AWS, you'll need to modify the EC2 instance security group inbound rules to have you IP address included for port 5432 SQL connections. Otherwise, it will not connect.

# Docs

[Setup Linux](https://www.sammeechward.com/deploying-full-stack-js-to-aws-ec2)
[Video](https://youtu.be/nQdyiK7-VlQ?si=EuVAm7SNc0f_vt65)
