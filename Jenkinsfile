node{
    stage('SonarCloud Analysis'){
        withSonarQubeEnv('sonar'){
        sh "/var/lib/jenkins/tools/hudson.plugins.sonar.SonarRunnerInstallation/sonar-qube2/bin/sonar-scanner \
        -D sonar.organization=astuatec \
        -D sonar.projectKey=astuaTEC_Basic-Api-NodeJS \
        -D sonar.sources=REST-API \
        -D sonar.exclusions=Jenkinsfile \
        -D sonar.host.url=https://sonarcloud.io"
        }
    }
}
