node{
    stage('SonarCloud Analysis'){
        withSonarQubeEnv('sonar-qube2'){
        sonar.organization=astuatec 
        sonar.projectKey=astuaTEC_Basic-Api-NodeJS 
        sonar.sources=/ 
        sonar.host.url=https://sonarcloud.io
        sh "sonar-qube2/bin/sonar-scanner"
        }
    }
}
