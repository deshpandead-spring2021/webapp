# AWS (CSYE 6225)

---------------------------------------------------------------

### Summary

This is a web application Library Information Management System built with NodeJS and Sequelize ORM with MySQL as database.

-   EC2 instances are built on a custom
    [AMI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html)
    using [packer](https://packer.io/)
-   Setting up the network and creation of resources is automated with
    Terraform, aws cli and shell scripts
-   Instances are autoscaled with
    [ELB](https://aws.amazon.com/elasticloadbalancing/) to handle the
    web traffic
-   Created a [serverless](https://aws.amazon.com/lambda/) application
    to facilitate "book add and book delete email" using
    [SES](https://aws.amazon.com/ses/) and
    [SNS](https://aws.amazon.com/sns/)
-   The application is deployed with GitHub Actions and AWS Code Deploy

### Architecture Diagram

 ![aws_full](https://user-images.githubusercontent.com/42703011/92800898-211c7580-f383-11ea-9b4e-76c171fca750.png)


Tools and Technologies
----------------------
                          
| Infrastructure       | VPC, ELB, EC2, Route53, Cloud formation, Shell, Packer |
|----------------------|--------------------------------------------------------|
| Webapp               | JavaScript, NodeJS, Express, MySQL, Sequelize          |
| CI/CD                | GitHub Actions, AWS Code Deploy                        |
| Alerting and logging | statsd, CloudWatch, SNS, SES, Lambda                   |
| Security             | Security Groups, IAM,WAF                               |


Infrastructure-setup
--------------------

-   Create the networking setup using Terraform
-   Create the required IAM policies and users
-   Setup Load Balancers, Route53, DynamoDB, SNS, SES, RDS

Webapp
------

-   The Library Information Management System Web application is developed using
    NodeJS Express framework that uses the REST architecture
-   Secured the application with [Basic Authentication Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)
    to retrieve user information
-   Created NPM dependencies to run the app locally and when deployed on
    AWS
-   Storing the images of books in S3

## Build Instructions
Pre-Requisites: Need to have postman installed
-  Install Node [NodeJS](https://nodejs.org/en/download/) if not already installed in the local machine
-  Clone this repository  into the local system 
-  Go to the folder /webapp
-  Download all npm dependencies by running "npm install" 
-  Run Webapp Application by typing **`*node server.js*`** 


## Running Tests
- Used mocha framework and junit for load testing test case.
- Run WebappApplication test cases:  `***node apptest.js***`


CI/CD
-----
-   Created yml files in workflows folder for GitHub actions. 
-   Bootstrapped the docker container in GitHub Actions to run the unit tests,
    integration tests and generate the artifact
-   The artifact generated is stored S3 bucket and deployed to an
    autoscaling group. ![CI_CD](https://user-images.githubusercontent.com/57328664/120083672-56473000-c098-11eb-8235-d03d70dea7ae.jpeg)


Auto scaling groups
-------------------

-   Created auto scaling groups to scale to the application to handle
    the webtraffic and keep the costs low when traffic is low
-   Created cloud watch alarms to scale up and scale down the EC2
    instances

Serverless computing
--------------------

-   Created a pub/sub system with SNS and lambda function
-   When the user request for a list of url to view added or deleted books within span of "c" days, send message is published to the SNS topic.
-   The lambda function checks for the entry of the emails in DynamoDB if
    it has no entry then it inserts a record with a TTL of 15 minutes
    and sends the notification to the user with SES ![alt
    text]![lambda](https://user-images.githubusercontent.com/42703011/92802718-c126ce80-f384-11ea-843f-a06d1267bdd9.png)


[Packer](https://packer.io/)
----------------------------

-   Implemented CI to build out an AMI and share it between organization
    on AWS
-   Created provisioners and bootstrapped the EC2 instance with required
    tools like NodeJS, Terraform  
    
    
## Team Information

| Name | NEU ID | Email Address |
| --- | --- | --- |
| ADITYA DESHPANDE| 001306705 |deshpande.ad@northeastern.edu|
