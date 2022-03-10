const { getAllFlagsData } = require("./flagsController");

let flags = [];
let clients = [];

const handleNewConnection = async (req, res, next) => {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  res.writeHead(200, headers);
  if (flags.length === 0) {
    flags = await getAllFlagsData();
  }
  const data = `data: ${JSON.stringify(flags)}\n\n`;

  res.write(data);

  const clientId = Date.now();

  const newClient = {
    id: clientId,
    res
  };

  clients.push(newClient);
  req.on('close', () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter(client => client.id !== clientId);
  });
}

const sendUpdate = (req, res, next) => {
  const updatedFlags = updateFlags(req, [...flags]);
  if (updateFlags) {
    flags = updatedFlags
    const data = `data: ${JSON.stringify(flags)}\n\n`;
    clients.forEach(({ res }) => res.write(data));
  }
}

const updateFlags = (req, flags) => {
  if (req.newFlag) {
    flags.push(req.newFlag);
  } else if (req.deletedFlagId) {
    flags = flags.filter(flag => flag.id !== req.deletedFlagId);
  } else if (req.updatedFlag) {
    flags = flags.map(flag => {
      return flag.id === req.updatedFlag.id ? req.updatedFlag : flag;
    });
  } else {
    return undefined
  }
  return flags;
}

exports.handleNewConnection = handleNewConnection;
exports.sendUpdate = sendUpdate
