console.log('\x1b[31m%s\x1b[0m', '                               > Goku                                            \n');
console.log('\x1b[31m%s\x1b[0m', '                               > https://github.com/Gokureal                             \n');


const readline = require("readline");
const request = require("request");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("\x1b[36m> Hesabının tokeni:\x1b[0m ", (token) => {//NOT YOUR BOT TOKEN YOUR ACCOUNT TOKEN
  rl.question("\x1b[36m> Server idn:\x1b[0m ", (guildId) => {
    rl.question("\x1b[36m> Discord Webhookun:\x1b[0m ", (webhookUrl) => {
      rl.question("\x1b[36m> Vanity URL:\x1b[0m ", (vanityUrl) => {
        const headers = {
          "authorization": token,
          "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
        };

        async function checkVanity() {
          while (true) {
            try {
              if (vanityUrl === "") {
                console.log('\x1b[36m%s\x1b[0m',"> Vanity URL boş yeni url bekleniyor...");
              } else {
                request.get({
                  url: `https://discord.com/api/v9/invites/${vanityUrl}?with_counts=true&with_expiration=true`,
                  headers: headers
                }, (error, response, body) => {
                  if (response && response.statusCode == 404) {
                    console.log('\x1b[36m%s\x1b[0m',`> Vanity Url Değiştiriliyor: ${vanityUrl}`);
                    changeVanity();
                  } else {
                    console.log('\x1b[36m%s\x1b[0m',`> Vanity URL aktif: ${vanityUrl}`);
                  }
                });
              }
            } catch (error) {
              console.log('\x1b[31m%s\x1b[0m', "> Rate limit g.o");
            }
          }
        }

        function changeVanity() {
          const payload = { "code": vanityUrl };
          request.patch({
            url: `https://discord.com/api/v10/guilds/${guildId}/vanity-url`,
            headers: headers,
            json: payload
          }, (error, response, body) => {
            if (response.statusCode == 200) {
              console.log('\x1b[36m%s\x1b[0m',`> URL Değişti: ${vanityUrl}`);
              const data = {
                content: `@everyone discord.gg/${vanityUrl} artık senin`,
                username: "Goku",
                avatar_url: "https://cdn.discordapp.com/avatars/216367803647787013/3da6b37008565000fff02ff1454912a6.png?size=4096"
              };      
              request.post({
                url: webhookUrl,
                json: data
              }, () => {
                process.exit(); 
              });
            } else {
              console.log('\x1b[36m%s\x1b[0m',`> vanity url değişilemedi error kod: ${response.statusCode}`);
            }
          });
        }

        checkVanity();
      });
    });
  });
});

