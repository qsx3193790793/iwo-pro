#FROM registry02.ctyundao.cn/workorder-cloud/nginx:1.18.0
FROM yd02-artifact.srdcloud.cn/jy_kfgd-release-docker-local/nginx-arm64:1.25
ADD client.tar /usr/share/nginx/html/
COPY nginx-grey.conf /etc/nginx/nginx.conf
#RUN ln -sf /dev/stdout /var/log/nginx/access_static.log && ln -sf /dev/stdout /var/log/nginx/access_api.log && ln -sf /dev/stdout /var/log/nginx/access_route.log && ln -sf /dev/stdout /var/log/nginx/access_nfs.log  &&  ln -sf /dev/stderr /var/log/nginx/error.log
# 修改docker时区为东八区，规避应用程序和北京时间相差8小时问题
ENV TZ=Asia/Shanghai
#CMD ['sh','-c','echo set \$PROVINCE_GATEWAY $PROVINCE_GATEWAY\; > /etc/nginx/conf.d/env.variable']
ENTRYPOINT envsubst '$province_gateway' > nginx.conf && cat nginx.conf && nginx -g 'daemon off;'