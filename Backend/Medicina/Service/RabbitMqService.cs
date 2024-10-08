using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Text;
using Microsoft.Extensions.Configuration;

public class RabbitMQService
{
    private readonly IConfiguration _configuration;

    public RabbitMQService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void SendMessage(string message)
    {
        var factory = new ConnectionFactory()
        {
            HostName = _configuration["RabbitMQConnection:HostName"],
            UserName = _configuration["RabbitMQConnection:UserName"],
            Password = _configuration["RabbitMQConnection:Password"],
            VirtualHost = _configuration["RabbitMQConnection:VirtualHost"],
            Port = int.Parse(_configuration["RabbitMQConnection:Port"])
        };

        using (var connection = factory.CreateConnection())
        using (var channel = connection.CreateModel())
        {
            channel.QueueDeclare(queue: "vehicleCoordinatesQueue",
                                 durable: false,
                                 exclusive: false,
                                 autoDelete: false,
                                 arguments: null);

            var body = Encoding.UTF8.GetBytes(message);

            channel.BasicPublish(exchange: "",
                                 routingKey: "vehicleCoordinatesQueue",
                                 basicProperties: null,
                                 body: body);
        }
    }
}
