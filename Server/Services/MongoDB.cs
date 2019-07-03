namespace Server
{
    public class MongoDB : IMongoDB
    {
        public string UsersCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string Database { get; set; }
    }

    public interface IMongoDB
    {
        string UsersCollectionName { get; set; }
        string ConnectionString { get; set; }
        string Database { get; set; }
    }
}