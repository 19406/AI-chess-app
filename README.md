# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

___________________________________________________________________________________________________________________________

Đây là một ứng dụng chơi cờ. Nó có gì? Mở lên đi rồi biết! Bye.

CÁC LOGIC ĐƯỢC XỬ LÝ (nếu có thiếu sót gì mình sẽ bổ sung thêm):

    _ CÁC LUẬT ĐIỀU KHIỂN:
        + Trò chơi có 2 lượt: trắng và đen, sẽ thay đổi luân phiên.
            <> Nếu undo mà mới đi được nước đầu tiên thì sẽ trả về trạng thái ban đầu.
            <> Nếu trường hợp khác thì sẽ lùi bàn cờ về 2 nước và đổi lượt di chuyển hiện tại.
        + Theo quy ước thì người chơi là quân trắng, còn AI cờ vua là quân đen.
        + Có 3 mức độ khó:
            <> Dễ
            <> Trung bình
            <> Khó
            (Đừng tin quá, người chơi nên tự chơi và tự cảm nhận)

    _ CÁC LUẬT DI CHUYỂN:
        + Quân TỐT:
            <> Nước đầu có thể tiến 2, các nước còn lại tiến 1.
        + Quân XE:
            <> Đi dọc và đi ngang.
        + Quân MÃ:
            <> Đi hình chữ L, không bị chặn.
        + Quân TƯỢNG:
            <> Đi chéo.
        + Quân HẬU:
            <> Đi chéo, đi dọc, đi ngang.
        + Quân VUA:
            <> Đi đến các ô xung quanh nó.
            <> Không đi vào các ô có thể bị ăn. (Vua không được chết trong cờ vua!)
            <> Có thể NHẬP THÀNH với 1 trong 2 xe nếu:
                # Cả Vua và Xe đó đều chưa từng di chuyển.
                # Giữa Vua và Xe đó không có quân nào.
                # Các ô giữa Vua và Xe đang không bị tấn công.
                # Vua đang không bị chiếu.
        + Nếu Vua đang bị chiếu, các quân của phe đó (kể cả Vua) chỉ được đi các nước thoát chiếu.
    
    _ CÁC LUẬT ĂN QUÂN:
        + Quân TỐT:
            <> Ăn chéo (nhưng chỉ chéo tiến).
            <> BẮT TỐT QUA ĐƯỜNG (ghi vậy chứ chưa có làm nha):
                Nếu:
                    # Quân tốt địch chỉ mới đi nước đầu tiên, và nước đó là tiến 2 bước.
                    # Tốt phe ta đứng cạnh và cùng hàng với tốt địch phía trên.
                
                Thì tốt phe ta có thể ăn tốt địch và đi chéo lên cột của tốt địch đó.
        + Các quân XE, MÃ, TƯỢNG, HẬU:
            <> Đi được đến đâu là ăn được đến đó.
        + Quân VUA:
            <> Vẫn là đi được đến đâu thì ăn được đến đó; nhưng: không được ăn quân mà sau khi ăn xong sẽ có thể bị quân khác ăn lại. (Vua không được chết trong cờ vua!)

    _ KẾT THÚC VÁN CỜ:
        + Nếu một bên đang bị chiếu và hết nước đi, bên đó bị chiếu hết và bên còn lại thắng.
        + Nếu một bên hết nước đi mà không bị chiếu, ván cờ kết thúc ở thế hoà.
        + Có thể hoà cờ nếu 2 bên không còn đủ quân (số quân đó không đủ để bất cứ bên nào chiếu hết!):
            <> Bàn cờ chỉ còn 2 Vua.
            <> Còn 2 Vua và 1 Tượng hoặc 2 Vua và 1 Mã.
            <> Mỗi bên còn Vua và 1 Tượng, nhưng 2 Tượng cùng màu ô.
        + Nếu một trạng thái của bàn cờ được lặp lại 3 lần thì ván cờ cũng sẽ kết thúc.


CÁC HIỆU ỨNG:
    _ Người chơi nhìn thấy các nước đi khả thi của từng quân cờ phe mình.
        + Nước đi vào ô trống sẽ có màu xanh lá.
        + Nước đi ăn quân sẽ có màu đỏ.
    _ Nước đi sau cùng của ván đấu sẽ được tô vàng để người chơi dễ quan sát (biết đối thủ đi chưa và đi đâu).
    _ Nếu quân Vua (của bên bất kỳ) đang bị chiếu, ô của quân Vua đó sẽ chuyển sang đỏ và có hiệu ứng nhấp nháy.

TƯƠNG TÁC:
    _ Chọn quân cờ sau đó chọn một ô mà nó có thể đi để thực hiện nước đi.
    _ Bấm vào nút màu xanh dương bên dưới bàn cờ hoặc nhấn tổ hợp phím Ctrl + Z để undo.
    _ Bấm vào biểu tượng reload màu xanh lá ở góc màn hình để bắt đầu trận mới.
    _ Khi bắt đầu ván đấu, sẽ có cửa sổ pop-up hiện lên để chọn độ khó.