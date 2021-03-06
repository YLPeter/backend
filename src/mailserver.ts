import {
  SMTPServer,
  SMTPServerAddress,
  SMTPServerAuthentication,
  SMTPServerAuthenticationResponse,
  SMTPServerDataStream,
  SMTPServerOptions,
  SMTPServerSession,
} from 'smtp-server';

import * as fs from 'fs';
import { AddressInfo } from 'net';
import { MailParser } from 'mailparser';
// import path from 'path';
import axios from 'axios';
const url = 'http://innoplus.xyz:4000/emails';
interface MailData {
  [key: string]: string;
}
async function sendMailData(mailData: MailData) {
  try {
    const response = await axios.post(url, mailData);
    // console.log(response);
  } catch (error) {
    console.error(error);
  }
}
function writeHTMLfile(str_to_write: string) {
  const path = require('path');
  const d = new Date();
  let filename =
    'html_email/' +
    'Source-' +
    d.getDate() +
    '_' +
    (d.getMonth() + 1) +
    '_' +
    d.getFullYear() +
    '-';
  filename += d.getHours() + '_' + d.getMinutes();
  filename += '.html';
  console.log(filename);
  const p = path.join('./', filename);
  fs.writeFile(p, str_to_write, (err) => {
    console.log(err ? err : 'Success!');
  });
}
function test_with_handlers_as_options(): void {
  const mailData: MailData = {};
  const options: SMTPServerOptions = {
    // secure: true,
    key: fs.readFileSync('./SMTPserver.key'),
    cert: fs.readFileSync('./SMTPserver.crt'),
    // hideSTARTTLS: true,
    authOptional: true,
    onAuth,
    onConnect,
    onMailFrom,
    onRcptTo,
    onData,
    onClose,
  };

  const port = 25; //995 ;//110 ;//993 ;//143 ;//587;//25,2525,465
  console.log('mail server,', port);
  function onConnect(
    session: SMTPServerSession,
    callback: (err?: Error) => void,
  ): void {
    console.log(`[${session.id}] onConnect`);
    callback();
  }

  function onAuth(
    auth: SMTPServerAuthentication,
    session: SMTPServerSession,
    callback: (
      err: Error | undefined,
      response?: SMTPServerAuthenticationResponse,
    ) => void,
  ): void {
    console.log(`[${auth.username}] username`);
    console.log(`[${auth.password}] password`);
    console.log(`[${auth.method}] method`);
    if (
      // auth.method === 'LOGIN' &&
      // auth.username === 'username' &&
      // auth.password === 'password'
      true
    ) {
      console.log('auth.username', auth.username);
      console.log('auth.password', auth.password);
      callback(undefined, { user: auth.username });
    } else {
      console.log('wrong username', auth.username);
      console.log('wrong password', auth.password);
      callback(new Error('Invalid username or password'));
    }
  }

  function onMailFrom(
    from: SMTPServerAddress,
    session: SMTPServerSession,
    callback: (err?: Error) => void,
  ): void {
    console.log(`[${session.id}] onMailFrom ${from.address}`);
    if (from.address.split('@')[1] === 'spammer.com') {
      // code 421 disconnects SMTP session immediately
      callback(
        Object.assign(new Error('we do not like spam!'), { responseCode: 421 }),
      );
    } else {
      callback();
    }
  }

  function onRcptTo(
    to: SMTPServerAddress,
    session: SMTPServerSession,
    callback: (err?: Error) => void,
  ): void {
    console.log(`[${session.id}] onRcptTo ${to.address}`);
    callback();
  }

  function onData(
    stream: SMTPServerDataStream,
    session: SMTPServerSession,
    callback: (err?: Error) => void,
  ): void {
    console.log(`[${session.id}] onData started`);

    if (stream.sizeExceeded) {
      callback(new Error('Message too big'));
      return;
    }

    let messageLength = 0;

    stream.on('data', (chunk: Buffer) => {
      console.log(
        `[${session.id}] onData got data chunk ${chunk.length} bytes`,
      );
      messageLength += chunk.length;
    });
    //stream.pipe(inboxPlusParser);
    let subject, text, html;
    const mailparser = new MailParser();
    mailparser.on('headers', (headers) => {
      subject = headers.get('subject');
    });

    mailparser.on('data', (data) => {
      if (data.type === 'text') {
        text = data.text;
      }

      console.log(`data,type:[${data.type}]`);
      if (data.html) {
        console.log(data.html);
        writeHTMLfile(data.html);
        html = data.html;
      }
    });
    mailparser.on('end', () => {
      console.log('MailParser subject', subject);
      console.log('MailParser text', text);
      mailData.subject = subject;
      mailData.text = text;
      mailData.html = html;
    });
    stream.pipe(mailparser);
    stream.once('end', () => {
      console.log(
        `[${session.id}] onData finished after reading ${messageLength} bytes`,
      );
      console.log(`session.id:[${session.id}]`);
      console.log(`session.remoteAddress:[${session.remoteAddress}]`);
      console.log(`session.clientHostname:[${session.clientHostname}]`);
      console.log(`session.openingCommand:[${session.openingCommand}]`);
      console.log(`session.hostNameAppearsAs:[${session.hostNameAppearsAs}]`);
      console.log(`session.envelope.mailFrom:[${session.envelope.mailFrom}]`);
      if (session.envelope.mailFrom) {
        mailData.sender = session.envelope.mailFrom.address;
        console.log(
          `session.envelope.mailFrom.address:[${session.envelope.mailFrom.address}]`,
        );
      } else {
        mailData.sender = '';
      }

      console.log(`session.envelope.rcptTo:[${session.envelope.rcptTo}]`);
      if (session.envelope.rcptTo) {
        mailData.receiver = session.envelope.rcptTo[0].address;
        console.log(
          `session.envelope.rcptTo[0].address:[${session.envelope.rcptTo[0].address}]`,
        );
      }
      console.log(`session.user:[${session.user}]`);
      // console.log(`session.transaction:[${session.transaction}]`);
      console.log(`session.transmissionType:[${session.transmissionType}]`);

      callback();
    });
  }

  function onClose(session: SMTPServerSession) {
    console.log(`[${session.id}] onClose`);
    sendMailData(mailData);
  }

  const server = new SMTPServer(options);

  server.on('error', (err) => {
    console.log(`Server got error:`, err);
  });

  server.on('close', () => {
    console.log('Server closed');
  });

  server.listen(port, () => {
    const address = server.server.address() as AddressInfo;
    console.log(`Listening on [${address.address}]:${address.port}`);
  });

  //   server.close(() => {
  //     console.log('Server closed');
  //   });
}
export default test_with_handlers_as_options;
