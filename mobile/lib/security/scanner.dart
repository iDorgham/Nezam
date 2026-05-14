import 'package:flutter/material.dart';

class SecurityScanner extends StatelessWidget {
  const SecurityScanner({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF121212),
      appBar: AppBar(
        backgroundColor: const Color(0xFF181818),
        title: const Text(
          'Nezam Security',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
      ),
      body: Column(
        children: [
          // Top Half: Camera View (Mocked)
          Expanded(
            flex: 1,
            child: Container(
              color: Colors.black,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  // Mock Camera Feed
                  const Icon(
                    Icons.qr_code_scanner,
                    color: Color(0xFF1DB954),
                    size: 100,
                  ),
                  
                  // Scanning Frame
                  Container(
                    width: 250,
                    height: 250,
                    decoration: BoxDecoration(
                      border: Border.all(color: const Color(0xFF1DB954), width: 2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  
                  // Capacity Counter Overlay
                  Positioned(
                    top: 20,
                    right: 20,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.7),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Text(
                        'Capacity: 450/500',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          
          // Bottom Half: Recent Scans
          Expanded(
            flex: 1,
            child: Container(
              color: const Color(0xFF181818),
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Recent Scans',
                    style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 10),
                  Expanded(
                    child: ListView(
                      children: [
                        _buildScanResult('Ahmed (VIP)', 'Table 4', 'Valid', true),
                        const SizedBox(height: 10),
                        _buildScanResult('Sara', 'Table 12', 'Valid', true),
                        const SizedBox(height: 10),
                        _buildScanResult('Ali', 'N/A', 'Expired Code', false),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: const Color(0xFF181818),
        selectedItemColor: const Color(0xFF1DB954),
        unselectedItemColor: const Color(0xFFB3B3B3),
        currentIndex: 0,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.camera_alt), label: 'Scan'),
          BottomNavigationBarItem(icon: Icon(Icons.list), label: 'List'),
          BottomNavigationBarItem(icon: Icon(Icons.bar_chart), label: 'Stats'),
        ],
      ),
    );
  }

  Widget _buildScanResult(String name, String table, String status, bool isValid) {
    return Container(
      padding: const EdgeInsets.all(12.0),
      decoration: BoxDecoration(
        color: const Color(0xFF282828),
        borderRadius: BorderRadius.circular(8.0),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              Text('Table: $table', style: const TextStyle(color: Color(0xFFB3B3B3), fontSize: 12)),
            ],
          ),
          Row(
            children: [
              Icon(
                isValid ? Icons.check_circle : Icons.cancel,
                color: isValid ? const Color(0xFF1DB954) : Colors.red,
                size: 16,
              ),
              const SizedBox(width: 5),
              Text(
                status,
                style: TextStyle(
                  color: isValid ? const Color(0xFF1DB954) : Colors.red,
                  fontWeight: FontWeight.bold,
                  fontSize: 12
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
