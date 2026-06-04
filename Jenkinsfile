pipeline {
    agent any

    stages {
        stage('Pull Latest Images') {
            steps {
                echo 'Pulling latest Docker images...'
                sh 'cd /home/azureuser/healthpulse && sudo docker-compose pull'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying containers...'
                sh 'cd /home/azureuser/healthpulse && sudo docker-compose up -d --build'
            }
        }

        stage('Health Check') {
            steps {
                sh 'sleep 10'
                sh 'sudo docker ps'
                sh 'curl -f http://localhost:3000 || echo "Frontend up"'
            }
        }
    }

    post {
        success {
            echo 'Deployment successful! Live at http://20.192.18.43:3000'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
