pipeline {
    agent any
    options {
        timeout(time: 1, unit: 'HOURS')
        disableConcurrentBuilds()
    }
    environment {
        CREDENTIALS_ID = 'github'
        SSH_KEY        = 'rishabh'
    }
    stages {
        stage("Set Branch Config") {
            steps {
                script {
                    def branchConfig = [
                        'dev': [
                            server_ip: '15.206.187.208',
                            deploy_dir: '/home/ubuntu/rgh-backend-dev'
                        ],
                        'test': [
                            server_ip: '15.206.187.209',   // apna test server IP daal
                            deploy_dir: '/home/ubuntu/rgh-backend-test'
                        ],
                        'main': [
                            server_ip: '15.206.187.210',   // apna prod server IP daal
                            deploy_dir: '/home/ubuntu/rgh-backend-prod'
                        ]
                    ]

                    if (!branchConfig.containsKey(env.BRANCH_NAME)) {
                        error "❌ No deployment config found for branch: ${env.BRANCH_NAME}"
                    }

                    env.SERVER_IP  = branchConfig[env.BRANCH_NAME].server_ip
                    env.DEPLOY_DIR = branchConfig[env.BRANCH_NAME].deploy_dir
                    env.SERVER_USER = 'ubuntu'

                    echo "Deploying branch '${env.BRANCH_NAME}' to ${env.SERVER_IP}:${env.DEPLOY_DIR}"
                }
            }
        }

        stage("List Files") {
            steps {
                sh 'ls -ltr'
            }
        }

        stage("Deploy to Server") {
            steps {
                sshagent(credentials: ["${env.SSH_KEY}"]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${env.SERVER_USER}@${env.SERVER_IP} '
                            set -e
                            cd ${env.DEPLOY_DIR}
                            PREV_COMMIT=\$(git rev-parse HEAD)
                            echo "Previous working commit: \$PREV_COMMIT"
                            git fetch origin ${env.BRANCH_NAME}
                            git reset --hard origin/${env.BRANCH_NAME}
                            if bash script.sh; then
                                echo "✅ Deployment succeeded on new commit."
                            else
                                echo "❌ Deployment failed! Rolling back to previous commit: \$PREV_COMMIT"
                                git reset --hard \$PREV_COMMIT
                                bash script.sh
                                echo "⚠️ Rolled back to previous working version."
                                exit 1
                            fi
                        '
                    """
                }
            }
        }
    }
    post {
        success {
            echo "✅ Deployment successful for branch ${env.BRANCH_NAME}!"
        }
        failure {
            echo "❌ Deployment failed for branch ${env.BRANCH_NAME}. Rollback attempted — check logs above."
        }
    }
}
