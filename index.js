const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.argv.length == 2 ? process.env.token : "";
const moment = require("moment");
require("moment-duration-format");
const welcomeChannelName = "안녕하세요";
const byeChannelName = "안녕히가세요";
const welcomeChannelComment = "어서오세요.";
const byeChannelComment = "안녕히가세요.";

client.on('ready', () => {
  console.log('켰다.');
  client.user.setPresence({ game: { name: '!도움말' }, status: 'online' })
});

client.on("guildMemberAdd", (member) => {
  const guild = member.guild;
  const newUser = member.user;
  const welcomeChannel = guild.channels.find(channel => channel.name == welcomeChannelName);

  welcomeChannel.send(`<@${newUser.id}> ${welcomeChannelComment}\n`);

  member.addRole(guild.roles.find(role => role.name == "민간인"));
});

client.on("guildMemberRemove", (member) => {
  const guild = member.guild;
  const deleteUser = member.user;
  const byeChannel = guild.channels.find(channel => channel.name == byeChannelName);

  byeChannel.send(`<@${deleteUser.id}> ${byeChannelComment}\n`);
});

client.on('message', (message) => {
  if(message.author.bot) return;

  if(message.content == '하정봇안녕') {
    return message.reply('안녕');
  }

  if(message.content == '!봇상태') {
    let embed = new Discord.RichEmbed()
    let img = 'https://cdn.discordapp.com/attachments/727157966855471234/727358568793374730/7b60da1b4cc7a645.jpg';
    var duration = moment.duration(client.uptime).format(" D [일], H [시간], m [분], s [초]");
    embed.setColor('#ffffff')
    embed.setAuthor('현재 서버의 정보 by 하정봇', img)
    embed.setFooter(`하정봇`)
    embed.addBlankField()
    embed.addField('RAM 사용량',    `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true);
    embed.addField('업타임', `${duration}`, true);
    embed.addField('하정봇사용자',         `${client.users.size.toLocaleString()}`, true);
    embed.addField('서버수',       `${client.guilds.size.toLocaleString()}`, true);
    // embed.addField('channel',      `${client.channels.size.toLocaleString()}`, true);
    embed.addField('Discord.js',   `v${Discord.version}`, true);
    embed.addField('Node',         `${process.version}`, true);

    embed.setTimestamp()
    message.channel.send(embed);
  }

  if(message.content == '!하정봇') {
    let img = 'https://cdn.discordapp.com/attachments/727157966855471234/727358568793374730/7b60da1b4cc7a645.jpg';
    let embed = new Discord.RichEmbed()
      .setTitle('오류문의')
      .setURL('https://discord.com/invite/s5bRVrD')
      .setAuthor('하정봇', img, 'https://discord.com/invite/s5bRVrD')
      .setColor('#dfde56')
      .setThumbnail(img)
      .addBlankField()
      .addField('봇 주인', '민슬아#7938')
      .addField('봇 이름', '하정봇#7946', true)
      .addField('타이틀', '추가예정', true)
      .addField('타이틀', '추가예정', true)
      .addField('타이틀', '추가예정\n추가예정\n추가예정\n')
      .addBlankField()
      .setTimestamp()
      .setFooter('made by 민슬아', img)

    message.channel.send(embed)
  } else if(message.content == '!도움말') {
    let helpImg = 'https://images-ext-1.discordapp.net/external/RyofVqSAVAi0H9-1yK6M8NGy2grU5TWZkLadG-rwqk0/https/i.imgur.com/EZRAPxR.png';
    let commandList = [
      {name: '하정봇안녕', desc: '하정봇이 인사합니다'},
      {name: '!초대코드', desc: '디스코드 주소가 나옵니다'},
      {name: '!하정봇', desc: '하정봇의 정보가 나옵니다'},
      {name: '!봇상태', desc: '봇 상태를 알려줍니다'},
      {name: '관지라', desc: '명령어'},
      {name: '!디엠', desc: 'dm으로 전체 공지 발송'},
      {name: '!청소', desc: '채팅방을 청소합니다'},
    ];
    let commandStr = '';
    let embed = new Discord.RichEmbed()
      .setAuthor('하정봇 명령어', helpImg)
      .setColor('#186de6')
      .setFooter(`하정봇`)
      .setTimestamp()
    
    commandList.forEach(x => {
      commandStr += `• \`\`${changeCommandStringLength(`${x.name}`)}\`\` : **${x.desc}**\n`;
    });

    embed.addField('Commands: ', commandStr);

    message.channel.send(embed)
  } else if(message.content == '!초대코드100') {
    client.guilds.array().forEach(x => {
      x.channels.find(x => x.type == 'text').createInvite({maxAge: 0}) // maxAge: 0은 무한이라는 의미, maxAge부분을 지우면 24시간으로 설정됨
        .then(invite => {
          message.channel.send(invite.url)
        })
        .catch((err) => {
          if(err.code == 50013) {
            message.channel.send('**'+x.channels.find(x => x.type == 'text').guild.name+'** 채널 권한이 없어 초대코드 발행 실패')
          }
        })
    });
  } else if(message.content == '!초대코드') {
    if(message.channel.type == 'dm') {
      return message.reply('dm에서 사용할 수 없는 명령어 입니다.');
    }
    message.guild.channels.get(message.channel.id).createInvite({maxAge: 0}) // maxAge: 0은 무한이라는 의미, maxAge부분을 지우면 24시간으로 설정됨
      .then(invite => {
        message.channel.send(invite.url)
      })
      .catch((err) => {
        if(err.code == 50013) {
          message.channel.send('**'+message.guild.channels.get(message.channel.id).guild.name+'** 채널 권한이 없어 초대코드 발행 실패')
        }
      })
  } else if(message.content.startsWith('!디엠')) {
    if(checkPermission(message)) return
    if(message.member != null) { // 채널에서 공지 쓸 때
      let contents = message.content.slice('!디엠'.length);
      let embed = new Discord.RichEmbed()
        .setAuthor('전체dm 공지')
        .setColor('#00f9ff')
        .setFooter(`하정봇`)
        .setTimestamp()
  
      embed.addField('공지: ', contents);
  
      message.member.guild.members.array().forEach(x => {
        if(x.user.bot) return;
        x.user.send(embed)
      });
  
      return message.reply('공지를 전송완료');
    } else {
      return message.reply('채널에서 실행해주세요');
    }
  } else if(message.content.startsWith('!디엠공지')) {
    if(checkPermission(message)) return
    if(message.member != null) { // 채널에서 공지 쓸 때
      let contents = message.content.slice('!일반공지'.length);
      message.member.guild.members.array().forEach(x => {
        if(x.user.bot) return;
        x.user.send(`${contents}`);
      });
  
      return message.reply('공지를 전송완료');
    } else {
      return message.reply('채널에서 실행해주세요');
    }
  } else if(message.content.startsWith('!삭제')) {
    if(message.channel.type == 'dm') {
      return message.reply('dm에서 사용할 수 없는 명령어 입니다.');
    }
    
    if(message.channel.type != 'dm' && checkPermission(message)) return

    var clearLine = message.content.slice('!삭제 '.length);
    var isNum = !isNaN(clearLine)

    if(isNum && (clearLine <= 0 || 100 < clearLine)) {
      message.channel.send("1부터 100까지의 숫자만 입력해주세요.")
      return;
    } else if(!isNum) { // c @나긋해 3
      if(message.content.split('<@').length == 2) {
        if(isNaN(message.content.split(' ')[2])) return;

        var user = message.content.split(' ')[1].split('<@!')[1].split('>')[0];
        var count = parseInt(message.content.split(' ')[2])+1;
        let _cnt = 0;

        message.channel.fetchMessages().then(collected => {
          collected.every(msg => {
            if(msg.author.id == user) {
              msg.delete();
              ++_cnt;
            }
            return !(_cnt == count);
          });
        });
      }
    } else {
      message.channel.bulkDelete(parseInt(clearLine)+1)
        .then(() => {
          AutoMsgDelete(message, `<@${message.author.id}> ` + parseInt(clearLine) + "개 채팅 삭제 완료!");
        })
        .catch(console.error)
    }
  }
});

function checkPermission(message) {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.send(`<@${message.author.id}> ` + "관리자 권한이 없거나 명령어를 사용할수 있는 권한이 없습니다")
    return true;
  } else {
    return false;
  }
}

function changeCommandStringLength(str, limitLen = 8) {
  let tmp = str;
  limitLen -= tmp.length;

  for(let i=0;i<limitLen;i++) {
      tmp += ' ';
  }

  return tmp;
}

async function AutoMsgDelete(message, str, delay = 3000) {
  let msg = await message.channel.send(str);

  setTimeout(() => {
    msg.delete();
  }, delay);
}


client.login(token);