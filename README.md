# MedOps — Demo cổng nhà thuốc Dược Vương

**Mở demo:** https://jetamin94.github.io/medops-pharmacy-demo/

Bản prototype dành để giới thiệu cho chủ chuỗi nhà thuốc, xuất từ thiết kế Pharmacy Portal ngày 30/09/2026. Nhấn **Đăng nhập** với dữ liệu được điền sẵn để bắt đầu; không cần tài khoản thật. Mọi số liệu và thao tác trong prototype là minh họa, không kết nối hệ thống vận hành.

Chỉ gồm cổng nhà thuốc. Tên chuỗi, chi nhánh, email và mã mẫu đã đổi sang Dược Vương. Bản demo cũ vẫn ở https://jetamin94.github.io/medops-prototype/.

## Nguồn và triển khai

- Nguồn: [Claude Design — Pharmacy Portal](https://claude.ai/design/p/ff9093a0-40ee-40de-857e-85743ad0e3c1?file=Pharmacy+Portal.html).
- Chỉ lấy các tệp được Pharmacy Portal sử dụng; không đưa cổng NCC, Console, Mobile, bản sao lưu hay tài liệu nội bộ vào repo.
- HTML, JSX, React 18.3.1, ReactDOM 18.3.1, Babel 7.29.0 và font được phục vụ ngay trong repo. Không cần dịch vụ Claude để chạy.
- GitHub Pages phục vụ nhánh `main` tại `/`; `.nojekyll` giữ nguyên các thư mục tài nguyên.
- React, ReactDOM và Babel giữ thông báo giấy phép trong tệp thư viện. Montserrat và Public Sans sử dụng SIL Open Font License.

Prototype thể hiện thiết kế tại thời điểm xuất, không phải cam kết tính năng đã triển khai trong sản phẩm.
