exports.run = async (message) => {
  message.channel.send(
    `My ping is  ${Date.now() - message.createdTimestamp}ms.The API Latency is ${Math.round(
      message.client.ws.ping
    )}ms`
  );
};
