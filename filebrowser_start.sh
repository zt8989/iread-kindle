export GIN_MODE=release 
iptables -I INPUT -p tcp --dport 8080 -j ACCEPT
iptables -A INPUT -s 127.0.0.2 -d 127.0.0.1 -j ACCEPT
./iread-kindle > /dev/null