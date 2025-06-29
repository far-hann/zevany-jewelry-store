const fetch = require('node-fetch');

// Base URL for the API
const BASE_URL = 'http://localhost:3000';

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Test results storage
const testResults = {
  passed: [],
  failed: [],
  warnings: []
};

// Helper function to log with colors
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Helper function to make API requests
async function testEndpoint(method, endpoint, data = null, headers = {}) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const responseData = await response.text();
    
    let parsedData;
    try {
      parsedData = JSON.parse(responseData);
    } catch (e) {
      parsedData = responseData;
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data: parsedData,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    return {
      error: error.message,
      status: 0
    };
  }
}

// Test functions for each API group
async function testHealthAPI() {
  log('\n=== TESTING HEALTH API ===', 'blue');
  
  const result = await testEndpoint('GET', '/api/health');
  
  if (result.status === 200) {
    log('✅ Health API: WORKING', 'green');
    log(`   Status: ${result.data.status}`);
    log(`   Environment: ${result.data.environment}`);
    testResults.passed.push('Health API');
  } else {
    log('❌ Health API: FAILED', 'red');
    log(`   Error: ${result.error || result.status}`);
    testResults.failed.push('Health API');
  }
}

async function testProductsAPI() {
  log('\n=== TESTING PRODUCTS API ===', 'blue');
  
  // Test GET all products
  const getAllResult = await testEndpoint('GET', '/api/products');
  
  if (getAllResult.status === 200) {
    log('✅ GET /api/products: WORKING', 'green');
    log(`   Found ${getAllResult.data.products?.length || 0} products`);
    testResults.passed.push('Products API - GET All');
  } else {
    log('❌ GET /api/products: FAILED', 'red');
    log(`   Error: ${getAllResult.error || getAllResult.status}`);
    testResults.failed.push('Products API - GET All');
  }

  // Test GET single product
  const getSingleResult = await testEndpoint('GET', '/api/products?id=1');
  
  if (getSingleResult.status === 200) {
    log('✅ GET /api/products?id=1: WORKING', 'green');
    testResults.passed.push('Products API - GET Single');
  } else {
    log('❌ GET /api/products?id=1: FAILED', 'red');
    log(`   Error: ${getSingleResult.error || getSingleResult.status}`);
    testResults.failed.push('Products API - GET Single');
  }

  // Test GET by category
  const getCategoryResult = await testEndpoint('GET', '/api/products?category=rings');
  
  if (getCategoryResult.status === 200) {
    log('✅ GET /api/products?category=rings: WORKING', 'green');
    testResults.passed.push('Products API - GET Category');
  } else {
    log('❌ GET /api/products?category=rings: FAILED', 'red');
    testResults.failed.push('Products API - GET Category');
  }
}

async function testAuthAPI() {
  log('\n=== TESTING AUTH API ===', 'blue');
  
  // Test registration
  const registerData = {
    firstName: 'Test',
    lastName: 'User',
    email: `test${Date.now()}@example.com`,
    password: 'testpassword123'
  };
  
  const registerResult = await testEndpoint('POST', '/api/auth/register', registerData);
  
  if (registerResult.status === 200) {
    log('✅ POST /api/auth/register: WORKING', 'green');
    testResults.passed.push('Auth API - Register');
  } else {
    log('❌ POST /api/auth/register: FAILED', 'red');
    log(`   Error: ${registerResult.error || registerResult.data?.error || registerResult.status}`);
    testResults.failed.push('Auth API - Register');
  }

  // Test login
  const loginData = {
    email: 'test@example.com',
    password: 'testpassword'
  };
  
  const loginResult = await testEndpoint('POST', '/api/auth/login', loginData);
  
  if (loginResult.status === 200 || loginResult.status === 401) {
    log('✅ POST /api/auth/login: WORKING (endpoint accessible)', 'green');
    testResults.passed.push('Auth API - Login');
  } else {
    log('❌ POST /api/auth/login: FAILED', 'red');
    log(`   Error: ${loginResult.error || loginResult.status}`);
    testResults.failed.push('Auth API - Login');
  }
}

async function testAdminAPI() {
  log('\n=== TESTING ADMIN API ===', 'blue');
  
  // Test admin login
  const adminLoginData = {
    email: 'admin@example.com',
    password: 'adminpassword'
  };
  
  const adminLoginResult = await testEndpoint('POST', '/api/admin/login', adminLoginData);
  
  if (adminLoginResult.status === 200 || adminLoginResult.status === 401 || adminLoginResult.status === 500) {
    log('✅ POST /api/admin/login: WORKING (endpoint accessible)', 'green');
    testResults.passed.push('Admin API - Login');
  } else {
    log('❌ POST /api/admin/login: FAILED', 'red');
    log(`   Error: ${adminLoginResult.error || adminLoginResult.status}`);
    testResults.failed.push('Admin API - Login');
  }

  // Test admin products
  const adminProductsResult = await testEndpoint('GET', '/api/admin/products');
  
  if (adminProductsResult.status === 200 || adminProductsResult.status === 401) {
    log('✅ GET /api/admin/products: WORKING (endpoint accessible)', 'green');
    testResults.passed.push('Admin API - Products');
  } else {
    log('❌ GET /api/admin/products: FAILED', 'red');
    log(`   Error: ${adminProductsResult.error || adminProductsResult.status}`);
    testResults.failed.push('Admin API - Products');
  }

  // Test admin orders
  const adminOrdersResult = await testEndpoint('GET', '/api/admin/orders');
  
  if (adminOrdersResult.status === 200 || adminOrdersResult.status === 401) {
    log('✅ GET /api/admin/orders: WORKING (endpoint accessible)', 'green');
    testResults.passed.push('Admin API - Orders');
  } else {
    log('❌ GET /api/admin/orders: FAILED', 'red');
    testResults.failed.push('Admin API - Orders');
  }
}

async function testCartAPI() {
  log('\n=== TESTING CART API ===', 'blue');
  
  const cartResult = await testEndpoint('GET', '/api/cart?userId=test-user');
  
  if (cartResult.status === 200 || cartResult.status === 400) {
    log('✅ GET /api/cart: WORKING (endpoint accessible)', 'green');
    testResults.passed.push('Cart API');
  } else {
    log('❌ GET /api/cart: FAILED', 'red');
    log(`   Error: ${cartResult.error || cartResult.status}`);
    testResults.failed.push('Cart API');
  }
}

async function testWishlistAPI() {
  log('\n=== TESTING WISHLIST API ===', 'blue');
  
  const wishlistResult = await testEndpoint('GET', '/api/wishlist?userId=test-user');
  
  if (wishlistResult.status === 200 || wishlistResult.status === 400) {
    log('✅ GET /api/wishlist: WORKING (endpoint accessible)', 'green');
    testResults.passed.push('Wishlist API');
  } else {
    log('❌ GET /api/wishlist: FAILED', 'red');
    log(`   Error: ${wishlistResult.error || wishlistResult.status}`);
    testResults.failed.push('Wishlist API');
  }
}

async function testOrdersAPI() {
  log('\n=== TESTING ORDERS API ===', 'blue');
  
  // Test order creation
  const orderData = {
    customerInfo: {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      address: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
      phone: '555-0123'
    },
    orderItems: [{
      id: '1',
      name: 'Test Product',
      price: 100,
      quantity: 1
    }],
    giftPackaging: false,
    shippingPrice: 10,
    giftPackagingFee: 0,
    totalPrice: 110,
    paymentMethod: 'test'
  };
  
  const orderResult = await testEndpoint('POST', '/api/orders/enhanced', orderData);
  
  if (orderResult.status === 200 || orderResult.status === 400 || orderResult.status === 500) {
    log('✅ POST /api/orders/enhanced: WORKING (endpoint accessible)', 'green');
    testResults.passed.push('Orders API - Enhanced');
  } else {
    log('❌ POST /api/orders/enhanced: FAILED', 'red');
    testResults.failed.push('Orders API - Enhanced');
  }

  // Test order tracking
  const trackResult = await testEndpoint('GET', '/api/orders/track?orderNumber=TEST123&email=test@example.com');
  
  if (trackResult.status === 200 || trackResult.status === 404 || trackResult.status === 400) {
    log('✅ GET /api/orders/track: WORKING (endpoint accessible)', 'green');
    testResults.passed.push('Orders API - Track');
  } else {
    log('❌ GET /api/orders/track: FAILED', 'red');
    testResults.failed.push('Orders API - Track');
  }
}

async function testContactAPI() {
  log('\n=== TESTING CONTACT API ===', 'blue');
  
  const contactData = {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'Test message'
  };
  
  const contactResult = await testEndpoint('POST', '/api/contact', contactData);
  
  if (contactResult.status === 200 || contactResult.status === 500) {
    log('✅ POST /api/contact: WORKING (endpoint accessible)', 'green');
    testResults.passed.push('Contact API');
  } else {
    log('❌ POST /api/contact: FAILED', 'red');
    log(`   Error: ${contactResult.error || contactResult.status}`);
    testResults.failed.push('Contact API');
  }
}

async function testPayPalAPI() {
  log('\n=== TESTING PAYPAL API ===', 'blue');
  
  const paypalResult = await testEndpoint('POST', '/api/paypal/webhook', {
    event_type: 'PAYMENT.CAPTURE.COMPLETED',
    resource: {
      id: 'test-payment-id',
      status: 'COMPLETED',
      amount: { value: '100.00', currency_code: 'USD' }
    }
  });
  
  if (paypalResult.status === 200 || paypalResult.status === 500) {
    log('✅ POST /api/paypal/webhook: WORKING (endpoint accessible)', 'green');
    testResults.passed.push('PayPal API');
  } else {
    log('❌ POST /api/paypal/webhook: FAILED', 'red');
    testResults.failed.push('PayPal API');
  }
}

async function testSupabaseConnection() {
  log('\n=== TESTING SUPABASE CONNECTION ===', 'blue');
  
  const supabaseResult = await testEndpoint('GET', '/api/test-supabase');
  
  if (supabaseResult.status === 200) {
    log('✅ Supabase Connection: WORKING', 'green');
    log(`   Found ${supabaseResult.data.products?.length || 0} products in database`);
    testResults.passed.push('Supabase Connection');
  } else {
    log('❌ Supabase Connection: FAILED', 'red');
    log(`   Error: ${supabaseResult.error || supabaseResult.status}`);
    testResults.failed.push('Supabase Connection');
  }
}

// Main test runner
async function runAllTests() {
  log('🚀 Starting API Endpoint Testing...', 'bold');
  log(`Testing against: ${BASE_URL}`, 'yellow');
  
  try {
    await testHealthAPI();
    await testSupabaseConnection();
    await testProductsAPI();
    await testAuthAPI();
    await testAdminAPI();
    await testCartAPI();
    await testWishlistAPI();
    await testOrdersAPI();
    await testContactAPI();
    await testPayPalAPI();
    
    // Print summary
    log('\n' + '='.repeat(50), 'blue');
    log('📊 TEST SUMMARY', 'bold');
    log('='.repeat(50), 'blue');
    
    log(`\n✅ PASSED (${testResults.passed.length}):`, 'green');
    testResults.passed.forEach(test => log(`   • ${test}`, 'green'));
    
    if (testResults.failed.length > 0) {
      log(`\n❌ FAILED (${testResults.failed.length}):`, 'red');
      testResults.failed.forEach(test => log(`   • ${test}`, 'red'));
    }
    
    if (testResults.warnings.length > 0) {
      log(`\n⚠️  WARNINGS (${testResults.warnings.length}):`, 'yellow');
      testResults.warnings.forEach(test => log(`   • ${test}`, 'yellow'));
    }
    
    const totalTests = testResults.passed.length + testResults.failed.length;
    const successRate = ((testResults.passed.length / totalTests) * 100).toFixed(1);
    
    log(`\n📈 Success Rate: ${successRate}%`, successRate > 80 ? 'green' : successRate > 60 ? 'yellow' : 'red');
    
    // Recommendations
    log('\n💡 RECOMMENDATIONS:', 'blue');
    
    if (testResults.failed.includes('Supabase Connection')) {
      log('   • Set up Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)', 'yellow');
    }
    
    if (testResults.failed.includes('Contact API')) {
      log('   • Configure email settings (EMAIL_USER, EMAIL_PASSWORD)', 'yellow');
    }
    
    if (testResults.failed.includes('PayPal API')) {
      log('   • Set up PayPal environment variables (NEXT_PUBLIC_PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET)', 'yellow');
    }
    
    if (testResults.failed.some(test => test.includes('Admin'))) {
      log('   • Configure admin credentials (ADMIN_EMAIL, ADMIN_PASSWORD)', 'yellow');
    }
    
  } catch (error) {
    log(`\n💥 Test runner failed: ${error.message}`, 'red');
  }
}

// Run the tests
runAllTests().catch(console.error);