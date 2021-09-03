node{
    stage('SonarCloud Analysis'){
        def scannerHome = tool 'SonarScanner 4.6.2.2472';
        withSonarQubeEnv('sonar-qube2'){
        sonar.organization=astuatec 
        sonar.projectKey=astuaTEC_Basic-Api-NodeJS 
        sonar.sources=/ 
        sonar.host.url=https://sonarcloud.io
        sh "sonar-qube2/bin/sonar-scanner"
        }
    }
}
