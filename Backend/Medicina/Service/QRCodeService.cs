using Medicina.Models;
using Newtonsoft.Json;
using System.Net.NetworkInformation;
using System;
using ZXing;
using SkiaSharp;
using ZXing.SkiaSharp.Rendering;
using System.Drawing;

namespace Medicina.Service
{
    public class QRCodeService
    {

        public byte[] GenerateQrCode(PickupReservation reservation)
        {
            try
            {
                string reservationJson = JsonConvert.SerializeObject(reservation);

                var writer = new BarcodeWriter<SKBitmap>
                {
                    Format = BarcodeFormat.QR_CODE,
                    Options = new ZXing.Common.EncodingOptions
                    {
                        Width = 300,
                        Height = 300,
                        Margin = 0
                    },
                    Renderer = new SKBitmapRenderer()
                };

                using (var bitmap = writer.Write(reservationJson))
                using (var image = SKImage.FromBitmap(bitmap))
                using (var data = image.Encode(SKEncodedImageFormat.Png, 100))
                {
                    return data.ToArray();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error generating QR code: {ex.Message}");
                throw;
            }
        }
    }
}