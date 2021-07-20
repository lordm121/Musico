exports.run = async(message ,args , client) => {
  let evaled;
        let code = args.join(" ");
            const hrStart = process.hrtime();
            evaled = eval(code);

            

            let response = '';

            response += `\`\`\`js\n${(evaled)}\n\`\`\`\n`;
         

            return message.channel.send(response).catch(console.error)
}