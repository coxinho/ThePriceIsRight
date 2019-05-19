using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ThePriceIsRightApi.Models;

namespace ThePriceIsRightApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ProductContext _context;

        public ProductController(ProductContext context)
        {
            _context = context;

            if (_context.ProductItems.Count() == 0)
            {
                // Create a new TodoItem if collection is empty,
                // which means you can't delete all TodoItems.
                _context.ProductItems.Add(new ProductItem {
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
                _context.ProductItems.Add(new ProductItem {
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
                _context.ProductItems.Add(new ProductItem {
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
                _context.SaveChanges();
            }
        }

        // GET: api/Product
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductItem>>> GetProductItems()
        {
            return await _context.ProductItems.ToListAsync();
        }

        // GET: api/Product/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductItem>> GetProductItem(long id)
        {
            var ProductItem = await _context.ProductItems.FindAsync(id);

            if (ProductItem == null)
            {
                return NotFound();
            }

            return ProductItem;
        }

        // POST: api/Product
        [HttpPost]
        public async Task<ActionResult<ProductItem>> PostProductItem(ProductItem product)
        {
            _context.ProductItems.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProductItem), new { id = product.Id }, product);
        }

        // PUT: api/Product/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductItem(long id, ProductItem product)
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
        public async Task<IActionResult> DeleteProductItem(long id)
        {
            var productItem = await _context.ProductItems.FindAsync(id);

            if (productItem == null)
            {
                return NotFound();
            }

            _context.ProductItems.Remove(productItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}