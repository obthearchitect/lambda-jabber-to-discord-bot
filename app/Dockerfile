FROM janaz/aws-lambda-node-runtime:test-1

COPY . ${LAMBDA_TASK_ROOT}
RUN npm install
RUN node --version

CMD ["index.handler"]
