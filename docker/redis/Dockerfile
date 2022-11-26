FROM redis:7.0.5
EXPOSE 6379

CMD redis-server

# ========================
# command 
# docker image build -t redis:latest .
# docker container run --rm -it --name redis -p 6379:6379 redis:latest

# command multiarchitect 
# docker buildx build --push --platform=linux/arm64,linux/amd64 -t <AWS ECR tag name> .
# docker buildx build --push --platform=linux/arm64,linux/amd64 -t public.ecr.aws/j1q2i1c5/redis:latest .
