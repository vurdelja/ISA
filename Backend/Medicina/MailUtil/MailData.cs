﻿using System.Collections.Generic;

namespace Medicina.MailUtil
{
    public class MailData
    {
        // Receiver
        public List<string> To { get; set; }
        public List<string> Bcc { get; set; }

        public List<string> Cc { get; set; }

        // Sender
        public string? From { get; set; }

        public string? DisplayName { get; set; }

        public string? ReplyTo { get; set; }

        public string? ReplyToName { get; set; }

        // Content
        public string Subject { get; set; }

        public string? Body { get; set; }

        public MailData(List<string> to, string subject, string? body = null, string? from = null, string? displayName = null, string? replyTo = null, string? replyToName = null, List<string>? bcc = null, List<string>? cc = null)
        {
            // Receiver
            To = to;
            Bcc = bcc ?? new List<string>();
            Cc = cc ?? new List<string>();

            // Sender
            From = from;
            DisplayName = displayName;
            ReplyTo = replyTo;
            ReplyToName = replyToName;

            // Content
            Subject = subject;
            Body = body;
        }

        public MailData()
        {
            To = new List<string>();
            Bcc = new List<string>();
            Cc = new List<string>();
        }
    }
}