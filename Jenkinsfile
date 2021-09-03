node{
    stage('SonarCloud Analysis'){
        withSonarQubeEnv('sonar-qube2'){
        sh "/var/lib/jenkins/tools/hudson.plugins.sonar.SonarRunnerInstallation/sonar-qube2/bin/sonar-scanner \
        -D sonar.organization=astuatec \
        -D sonar.projectKey=astuaTEC_Basic-Api-NodeJS \
        -D sonar.sources=. \
        -D sonar.host.url=https://sonarcloud.io"
        }
    }
}
