# AI Chess App - Giới thiệu

Đây là một ứng dụng chơi cờ. Người chơi sẽ được thử sức với AI cờ vua sử dụng thuật toán Minimax, với các mức độ khó khác nhau. Giao diện của ứng dụng vẫn còn rất đơn giản và chưa có nhiều tính năng, nhưng mong có thể mang đến cho bạn một trò tiêu khiển thú vị.

## Demo
[Truy cập bản chơi thử tại đây](https://19406.github.io/AI-chess-app/)

> Ứng dụng chưa hỗ trợ "Bắt Tốt qua đường" (En passant).

# Các logic được xử lý

Vẫn còn nhiều thứ chưa hoàn thiện, mình vẫn sẽ tiếp tục bổ sung thêm.

## Luật điều khiển

### Lượt chơi:
- Trò chơi có 2 lượt: **Trắng** và **Đen**, thay đổi luân phiên nhau
  - **Người chơi**: luôn là quân **Trắng**
  - **AI cờ vua**:luôn là quân **Đen**
### Độ khó:
- Trò chơi có 3 mức độ khó:
  - Dễ
  - Trung bình
  - Khó
  
  *(Đừng tin quá, người chơi nên tự chơi và tự cảm nhận)*

### Undo:
- **Trò chơi có hỗ trợ đi lại**
  - Nếu mới đi nước đầu tiên thì sẽ trả về trạng thái ban đầu
  - Nếu trường hợp khác thì lùi bàn cờ về 2 nước và đổi lượt di chuyển hiện tại

## Luật di chuyển:
| Quân cờ | Luật di chuyển |
|---------|----------------|
| **Tốt** | Nước đầu có thể tiến 2, các nước còn lại tiến 1 |
| **Xe** | Đi dọc và đi ngang |
| **Mã** | Đi hình chữ L, không bị chặn |
| **Tượng** | Đi chéo |
| **Hậu** | Đi chéo, đi dọc, đi ngang |
| **Vua** | Đi đến các ô xung quanh nó <br> Không đi vào các ô có thể bị ăn <br> *(Vua không được chết trong cờ vua!)* <br> Có thể **nhập thành** với 1 trong 2 Xe |

### Điều kiện nhập thành:
- *Cả Vua và Xe đó đều chưa từng di chuyển*
- *Giữa Vua và Xe đó không có quân nào*
- *Các ô giữa Vua và Xe đang không bị tấn công*
- *Vua đang không bị chiếu*

> Nếu Vua đang bị chiếu, các quân của phe đó (kể cả Vua) chỉ được đi các nước thoát chiếu
    
## Luật ăn quân:
### Quân TỐT:
- Ăn chéo (nhưng chỉ chéo tiến)

### Bắt Tốt qua đường:
- **Điều kiện**:
  - Quân tốt địch chỉ mới đi nước đầu tiên, và nước đó là tiến 2 bước
  - Tốt phe ta đứng cạnh và cùng hàng với tốt địch phía trên

- **Nước đi**: Tốt phe ta có thể ăn tốt địch và đi chéo lên cột của tốt địch đó

### Các quân XE, MÃ, TƯỢNG, HẬU:
- Đi được đến đâu là ăn được đến đó.
### Quân VUA:
- Vẫn là đi được đến đâu thì ăn được đến đó; **nhưng:** không được ăn quân mà sau khi ăn xong sẽ có thể bị quân khác ăn lại

*(Vua không được chết trong cờ vua!)*

## Kết thúc ván cờ:
- Nếu một bên đang bị chiếu và hết nước đi, bên đó bị chiếu hết và bên còn lại thắng
- Nếu một bên hết nước đi mà không bị chiếu, ván cờ kết thúc ở thế hoà
- Có thể hoà cờ nếu 2 bên không còn đủ quân (số quân đó không đủ để bất cứ bên nào chiếu hết!):
  - Bàn cờ chỉ còn 2 Vua
  - Còn 2 Vua và 1 Tượng hoặc 2 Vua và 1 Mã
  - Mỗi bên còn Vua và 1 Tượng, nhưng 2 Tượng cùng màu ô
- Nếu một trạng thái của bàn cờ được lặp lại 3 lần thì ván cờ cũng sẽ kết thúc

# Hiệu ứng UI:
## Giao diện:
- Giao diện trò chơi bao gồm:
  - Tag hiển thị lượt chơi hiện tại
  - Dòng văn bản hiển thị độ khó
  - Bàn cờ
  - Nút undo màu xanh dương phía dưới bàn cờ
  - Biểu tượng reload màu xanh lá ở góc trên bên phải màn hình
## Nước đi khả thi:
- Người chơi nhìn thấy các nước đi khả thi của từng quân cờ phe mình.
  - Nước đi vào ô trống sẽ có màu xanh lá
  - Nước đi ăn quân sẽ có màu đỏ
## Nước đi cuối:
- Nước đi sau cùng của ván đấu sẽ được tô vàng để người chơi dễ quan sát (biết đối thủ đi chưa và đi đâu)
## Ô đang bị chiếu:
- Nếu quân Vua (của bên bất kỳ) **đang bị chiếu**, ô của quân Vua đó sẽ chuyển sang đỏ và có hiệu ứng nhấp nháy

# Tương tác:
- **Thực hiện nước đi**: Chọn quân cờ sau đó chọn một ô mà nó có thể đi để thực hiện nước đi
- **Undo**: Bấm vào nút màu xanh dương bên dưới bàn cờ hoặc nhấn tổ hợp phím Ctrl + Z để undo
- **Bắt đầu trận mới**: Bấm vào biểu tượng reload màu xanh lá ở góc màn hình để bắt đầu trận mới
- **Chọn độ khó**: Khi bắt đầu ván mới, sẽ có cửa sổ pop-up hiện lên để chọn độ khó

# Công nghệ sử dụng

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- Web Worker cho AI
- Thuật toán Minimax + Alpha-Beta Pruning

# Cài đặt và chạy local

```bash
git clone https://github.com/19406/AI-chess-app.git
cd AI-chess-app
npm install
npm run dev
```

> Nhưng mà chơi online bằng đường dẫn trên phần demo đi chứ chạy local chi cho cực!