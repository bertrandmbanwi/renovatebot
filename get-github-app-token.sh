#!/bin/sh
set -e

#echo "Getting JWT Token"
JWT=$(ruby generate-jwt-token.rb)
# echo "jwt-token: ${jwt}"

#echo "curl -s -H \"Authorization: Bearer ${JWT}\" -H \"Accept: application/vnd.github+json\" https://api.github.com/app/installations"
#echo "Getting Github App Installation ID"
sleep 3
installation_id_response=$(curl -s -H "Authorization: Bearer ${JWT}" -H "Accept: application/vnd.github+json" https://api.github.com/app/installations)
# echo "${installation_id_response}"
installation_id=$(echo "$installation_id_response" | jq ".[] .id")
#echo "Installation ID: $installation_id"

if [ "$installation_id" = "null" ]; then
    echo "Unable to get installation ID. Is the GitHub App installed on ${repo}?"
    echo "$installation_id_response" | jq -r .message
    exit 1
fi

#echo "Creating Github App Access Token"
token_response=$(curl -s -X POST \
    -H "Authorization: Bearer ${JWT}" \
    -H "Accept: application/vnd.github+json" \
    https://api.github.com/app/installations/"${installation_id}"/access_tokens)
# echo $token_response
TOKEN=$(echo "$token_response" | jq -r .token)
EXPIRATION=$(echo "$token_response" | jq -r .expires_at)

if [ "$TOKEN" = "null" ]; then
    echo "Unable to generate installation access token"
    exit 1
fi

echo "${TOKEN}"
#echo "token expiration: ${EXPIRATION}"

