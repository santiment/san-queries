@Library('podTemplateLib')
import net.santiment.utils.podTemplates

properties([buildDiscarder(logRotator(artifactDaysToKeepStr: '30', artifactNumToKeepStr: '', daysToKeepStr: '30', numToKeepStr: ''))])

slaveTemplates = new podTemplates()

slaveTemplates.dockerTemplate { label ->
  node(label) {
    stage('Build') {
      container('docker') {
        def scmVars = checkout scm
        def gitHead = scmVars.GIT_COMMIT.substring(0,7)

        if (env.BRANCH_NAME == "queries-app") {
          withCredentials([
            string(
              credentialsId: 'SECRET_KEY_BASE',
              variable: 'SECRET_KEY_BASE'
            ),
            string(
              credentialsId: 'aws_account_id',
              variable: 'aws_account_id'
            )
          ]) {
            def awsRegistry = "${env.aws_account_id}.dkr.ecr.eu-central-1.amazonaws.com"
            docker.withRegistry("https://${awsRegistry}", "ecr:eu-central-1:ecr-credentials") {
              sh "docker build -t ${awsRegistry}/san-queries:stage -t ${awsRegistry}/san-queries:production -t ${awsRegistry}/san-queries:${scmVars.GIT_COMMIT} ."
              sh "docker push ${awsRegistry}/san-queries:stage"
              sh "docker push ${awsRegistry}/san-queries:production"
              sh "docker push ${awsRegistry}/san-queries:${scmVars.GIT_COMMIT}"
            }
          }
        }
      }
    }
  }
}
