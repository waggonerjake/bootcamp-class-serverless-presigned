source ./setEnvVars.sh

function main() {
aws cloudformation deploy --template-file iam-role.yaml --stack-name github-actions-role --region us-east-1 --parameter-overrides GitHubOrg="${GITHUB_USERNAME}" RepositoryName="${GITHUB_REPO}" --capabilities CAPABILITY_IAM
local ROLE_ARN=$(aws cloudformation --region us-east-1 describe-stacks --stack-name github-actions-role --query "Stacks[0].Outputs[?OutputKey=='Role'].OutputValue" --output text)
sed -i "s|role-to-assume:.*|role-to-assume: ${ROLE_ARN}|g" .github/workflows/pipeline.yaml
sed -i "s|bucketname:.*|bucketname: ${BUCKET_NAME}|g" .github/workflows/pipeline.yaml
}

main "$@"