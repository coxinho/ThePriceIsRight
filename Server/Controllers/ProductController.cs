using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System.Threading.Tasks;
using Server.Entities;
using Server.Helpers;

namespace ThePriceIsRightApi.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    [Authorize]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly DataContext _context;

        public ProductController(DataContext context)
        {
            _context = context;

            if (_context.Products.Count() == 0)
            {
                // Create a new TodoItem if collection is empty,
                // which means you can't delete all TodoItems.
                _context.Products.Add(new Product {
                    Ean = 000000000001,
                    Brand = "Nestle",
                    Name = "Leite Magro",
                    Photo = "/media/leite-magro.png",
                    Continente = 2.2F,
                    Lidl = 2.1F,
                    PingoDoce = 2.0F,
                    Intermarche = 2.0F,
                    Jumbo = 2.3F,
                    Dia = 1.9F
                });
                _context.Products.Add(new Product {
                    Ean = 000000000001,
                    Brand = "Nestle",
                    Name = "Leite Gordo",
                    Photo = "/media/leite-magro.png",
                    Continente = 2.2F,
                    Lidl = 2.1F,
                    PingoDoce = 2.0F,
                    Intermarche = 2.0F,
                    Jumbo = 2.3F,
                    Dia = 1.9F
                });
                _context.Products.Add(new Product {
                    Ean = 000000000001,
                    Brand = "Nestle",
                    Name = "Chocolate Quente",
                    Photo = "/media/leite-magro.png",
                    Continente = 2.2F,
                    Lidl = 2.1F,
                    PingoDoce = 2.0F,
                    Intermarche = 2.0F,
                    Jumbo = 2.3F,
                    Dia = 1.9F
                });
                _context.Products.Add(new Product {
                    Ean = 000000000001,
                    Brand = "Nestle",
                    Name = "Leite diferente",
                    Photo = "/media/leite-magro.png",
                    Continente = 2.2F,
                    Lidl = 2.1F,
                    PingoDoce = 2.0F,
                    Intermarche = 2.0F,
                    Jumbo = 2.3F,
                    Dia = 1.9F
                });
                _context.Products.Add(new Product {
                    Ean = 000000000001,
                    Brand = "Nestle",
                    Name = "Leite de soja",
                    Photo = "/media/leite-magro.png",
                    Continente = 2.2F,
                    Lidl = 2.1F,
                    PingoDoce = 2.0F,
                    Intermarche = 2.0F,
                    Jumbo = 2.3F,
                    Dia = 1.9F
                });
                _context.Products.Add(new Product {
                    Ean = 000000000001,
                    Brand = "Nestle",
                    Name = "Leite de côco",
                    Photo = "/media/leite-magro.png",
                    Continente = 2.2F,
                    Lidl = 2.1F,
                    PingoDoce = 2.0F,
                    Intermarche = 2.0F,
                    Jumbo = 2.3F,
                    Dia = 1.9F
                });
                _context.Products.Add(new Product {
                    Ean = 000000000001,
                    Brand = "Nestle",
                    Name = "Leite Meio-Gordo",
                    Photo = "/media/leite-magro.png",
                    Continente = 2.2F,
                    Lidl = 2.1F,
                    PingoDoce = 2.0F,
                    Intermarche = 2.0F,
                    Jumbo = 2.3F,
                    Dia = 1.9F
                });
                _context.SaveChanges();
            }
        }

        // GET: api/Product
        // GET: api/Product?search=Nestle
        [AllowAnonymous]
        [HttpGet]
        public JsonResult GetProducts(string search)
        {
            if(search == null)
                return new JsonResult(_context.Products.ToArray());
            else
                return new JsonResult(_context.Products.Where(Product => Product.Name.ToLower().Contains(search.ToLower())).ToArray());
        }

        // GET: api/Product/5
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(long id)
        {
            var Product = await _context.Products.FindAsync(id);

            if (Product == null)
            {
                return NotFound();
            }

            return Product;
        }

        // POST: api/Product
        [HttpPost]
        [Authorize(Policy = "AdminClaim")]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        // PUT: api/Product/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(long id, Product product)
        {
            if (id != product.Id)
            {
                return BadRequest();
            }

            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Product/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminClaim")]
        public async Task<IActionResult> DeleteProduct(long id)
        {
            var Product = await _context.Products.FindAsync(id);

            if (Product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(Product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}