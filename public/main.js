function create_UUID() {
    let dt = new Date().getTime();
    let uuid = 'xxx-xxxx-4xxx-yxxx-xxyy'.replace(/[xy]/g, function (c) {
        let r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}


const uuid = create_UUID()
const socket = io('http://localhost:8000', { transports: ['websocket'] });

new Vue({
    el: "#chat-app",
    data: {
        id: uuid,
        message: "",
        messages: [] = []
    },
    created() {
        this.replyChat()
    },
    methods: {
        sendMessage() {
            /* Emit event from client to server*/
            let newMessage = {
                id: uuid,
                body: this.message,
            };
            this.message = ""
            socket.emit('send', newMessage);
        },

        replyChat() {
            /* Listen server event response */
            socket.on('connect', () => {
                socket.on('reply', (msg) => {
                    this.messages.push(msg)
                });
            });
        }
    }
})