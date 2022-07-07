export function constructMessage(message, channel) {
  let msg = {
    id: '967590310844706906',
    type: 0,
    content: '',
    channel_id: channel.id,
    author: {
      id: '295468625240915968',
      username: 'funlennysub',
      avatar: '5a6ff8383a961ba5a7a1ca9f6bfefc54',
      discriminator: '6727',
      publicFlags: 640,
      avatarDecoration: null,
    },
    attachments: [],
    embeds: [],
    mentions: [],
    mention_roles: [],
    pinned: false,
    mention_everyone: false,
    tts: false,
    timestamp: '2022-04-24T00:58:27.064000+00:00',
    edited_timestamp: null,
    flags: 0,
    components: [],
  };

  if (typeof message === 'string') msg.content = message;
  else msg = { ...msg, ...message };

  return msg;
}
