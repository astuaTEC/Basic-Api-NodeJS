node{
    stage('SonarCloud Analysis'){
        def scannerHome = tool 'sonar-qube2';
        withSonarQubeEnv('sonar-qube2'){
        sonar.organization=astuatec 
        sonar.projectKey=astuaTEC_Basic-Api-NodeJS 
        sonar.sources=/ 
        sonar.host.url=https://sonarcloud.io
        sh "${scannerHome}/bin/sonar-scanner"
        }
    }
}
