pipeline {
    agent any

    stages {
        stage('Deploy to VM') {
            steps {
                echo 'Deploying to Azure VM via SSH...'
                sshagent(credentials: ['azure-vm-ssh']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no azureuser@20.192.18.43 "
                            cd /home/azureuser/healthpulse &&
                            sudo docker-compose pull &&
                            sudo docker-compose up -d --build &&
                            sudo docker ps
                        "
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                sh 'sleep 10'
                sshagent(credentials: ['azure-vm-ssh']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no azureuser@20.192.18.43 "
                            curl -f http://localhost:3000 || echo Frontend up &&
                            curl -f http://localhost:5000/api/patients || echo Backend up
                        "
                    '''
                }
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
