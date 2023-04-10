ps -aux|grep npm|awk '{print $2}'|xargs kill -9 ;
ps -aux|grep npx|awk '{print $2}'|xargs kill -9
ps -aux|grep chrome|awk '{print $2}'|xargs kill -9
