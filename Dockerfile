FROM tomcat:alpine
LABEL Name=HibahTerintegrasi Version=1.0.0
RUN rm /usr/local/tomcat/webapps/ROOT/index.jsp && rm /usr/local/tomcat/conf/context.xml
WORKDIR /usr/local/tomcat
COPY dist/ ./webapps/ROOT
COPY tomcat/WEB-INF/rewrite.config ./webapps/ROOT/WEB-INF
COPY tomcat/context.xml ./conf