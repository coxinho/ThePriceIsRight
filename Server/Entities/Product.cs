namespace Server.Entities
{
    public class Product
    {
        public long Id { get; set; }
        public long Ean { get; set; }
        public string Brand { get; set; }
        public string Name { get; set; }
        public string Photo { get; set; }
        /*public Supermarkets Supermarkets { get; set; } */
        public float Continente { get; set; }
        public float Lidl { get; set; }
        public float PingoDoce { get; set; }
        public float Intermarche { get; set; }
        public float Jumbo { get; set; }
        public float Dia { get; set; }
    }
}