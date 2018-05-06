module.exports = {
    "server_port": 7777,
    "use_proxy": true,
    "supervisor_path": "/supervisor_cabinet",
    "student_path": "/student_cabinet",
    "no_token_location": "proxy/authentication/?redirect=http://localhost:777",
    "origin_location": "http://localhost:7777",
    "db": "db",
    "proxy": "/proxy"
};