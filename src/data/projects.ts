export type RustProject = {
  id: string;
  title: string;
  description: string;
  level: string;
  estimate: string;
  tags: string[];
  objectives: string[];
  instructions: string[];
  starterCode: string;
  solutionCode: string;
  expectedOutput: string;
  accent: string;
};

const expensePrelude = `use std::collections::BTreeMap;

#[derive(Debug)]
struct Expense {
    category: String,
    amount: u64,
}
`;

const expenseMain = `
fn main() {
    let expenses = vec![
        Expense { category: "ăn uống".into(), amount: 80_000 },
        Expense { category: "đi lại".into(), amount: 100_000 },
        Expense { category: "ăn uống".into(), amount: 170_000 },
    ];

    // Đơn vị là đồng: dùng số nguyên để tránh sai số thập phân.
    assert_eq!(total_expenses(&[]), 0);
    assert_eq!(total_expenses(&expenses), 350_000);
    assert!(totals_by_category(&[]).is_empty());
    let categories = totals_by_category(&expenses);
    assert_eq!(categories.len(), 2);
    assert_eq!(categories.get("ăn uống"), Some(&250_000));
    assert_eq!(categories.get("đi lại"), Some(&100_000));
    assert_eq!(remaining_budget(500_000, &expenses), Some(150_000));
    assert_eq!(remaining_budget(350_000, &expenses), Some(0));
    assert_eq!(remaining_budget(300_000, &expenses), None);

    println!("Tổng chi: {} đ", total_expenses(&expenses));
    println!("Còn lại: {} đ", remaining_budget(500_000, &expenses).unwrap());
    for (category, amount) in categories {
        println!("{category}: {amount} đ");
    }
}
`;

const textPrelude = `use std::collections::BTreeMap;
`;

const textMain = `
fn main() {
    let text = "Rust vui. Rust an toàn, học Rust!";
    let words = tokenize(text);
    let counts = count_words(&words);

    assert!(tokenize(" 123... ").is_empty());
    assert_eq!(tokenize("  RUST,\\nViệt 123! "), vec!["rust", "việt"]);
    assert!(count_words(&[]).is_empty());
    assert_eq!(most_frequent(&BTreeMap::new()), None);
    assert_eq!(words.len(), 7);
    assert_eq!(counts.get("rust"), Some(&3));
    assert_eq!(counts.len(), 5);

    // Khi bằng số lần xuất hiện, ưu tiên thứ tự từ điển của Rust.
    let tied = count_words(&tokenize("B a b A c"));
    assert_eq!(most_frequent(&tied), Some(("a", 2)));

    let (word, count) = most_frequent(&counts).unwrap();
    println!("Số từ: {}", words.len());
    println!("Từ khác nhau: {}", counts.len());
    println!("Phổ biến nhất: {word} ({count})");
    println!("Ký tự (Unicode): {}", text.chars().count());
}
`;

const taskPrelude = `#[derive(Debug)]
struct Task {
    id: u32,
    title: String,
    done: bool,
}

#[derive(Default)]
struct TaskList {
    tasks: Vec<Task>,
    next_id: u32,
}
`;

const taskMain = `
fn main() {
    let mut list = TaskList::default();
    assert!(list.pending().is_empty());
    assert_eq!(list.add("   "), Err("Tên việc không được để trống"));

    let first = list.add("  Đọc về ownership  ").unwrap();
    let second = list.add("Làm bài tập Vec").unwrap();
    let third = list.add("Viết dự án đầu tay").unwrap();
    assert_eq!((first, second, third), (1, 2, 3));
    assert_eq!(list.tasks[0].title, "Đọc về ownership");
    assert_eq!(list.tasks.len(), 3);
    assert_eq!(list.complete(999), Err("Không tìm thấy công việc"));
    assert_eq!(list.pending().len(), 3);
    assert_eq!(list.complete(first), Ok(()));
    // Đánh dấu lại một việc đã xong vẫn thành công.
    assert_eq!(list.complete(first), Ok(()));
    assert_eq!(list.pending().len(), 2);

    println!("Công việc: {}", list.tasks.len());
    println!("Đã xong: {}", list.tasks.iter().filter(|task| task.done).count());
    for task in list.pending() {
        println!("[ ] #{} {}", task.id, task.title);
    }
}
`;

export const projects: RustProject[] = [
  {
    id: "expense-tracker",
    title: "Sổ tay chi tiêu",
    description:
      "Biến những khoản chi hằng ngày thành một báo cáo rõ ràng. Tính tổng, nhóm danh mục và kiểm tra ngân sách bằng Rust.",
    level: "Cơ bản",
    estimate: "40–60 phút",
    tags: ["Struct", "Vec", "BTreeMap", "Option"],
    objectives: [
      "Mô hình hóa một khoản chi bằng struct và xử lý một danh sách qua slice.",
      "Dùng BTreeMap để cộng dồn theo danh mục, đồng thời giữ thứ tự đầu ra ổn định.",
      "Biểu diễn tình huống vượt ngân sách bằng Option thay vì trừ số nguyên không an toàn.",
    ],
    instructions: [
      "Hoàn thiện total_expenses: trả về tổng amount của mọi khoản chi; danh sách rỗng phải trả về 0. Số tiền được lưu bằng u64, đơn vị đồng, với dữ liệu mẫu nằm trong giới hạn kiểu số.",
      "Hoàn thiện totals_by_category: cộng các khoản có cùng category vào một BTreeMap<String, u64>. Không thay đổi danh sách đầu vào.",
      "Hoàn thiện remaining_budget: trả Some(số tiền còn lại) khi tổng chi không vượt ngân sách; trả None nếu vượt. Gợi ý: checked_sub xử lý phép trừ này.",
      "Giữ các assert_eq! trong main và chạy thử cả danh sách rỗng, ngân sách vừa đủ, ngân sách bị vượt. Chương trình cuối cùng cần in đúng báo cáo mẫu.",
    ],
    starterCode:
      expensePrelude +
      `
fn total_expenses(expenses: &[Expense]) -> u64 {
    // TODO: Cộng amount của tất cả khoản chi.
    todo!("Tính tổng chi tiêu")
}

fn totals_by_category(expenses: &[Expense]) -> BTreeMap<String, u64> {
    // TODO: Nhóm các khoản chi theo category.
    todo!("Lập báo cáo theo danh mục")
}

fn remaining_budget(budget: u64, expenses: &[Expense]) -> Option<u64> {
    // TODO: Trả None nếu chi nhiều hơn ngân sách.
    todo!("Kiểm tra ngân sách")
}
` +
      expenseMain,
    solutionCode:
      expensePrelude +
      `
fn total_expenses(expenses: &[Expense]) -> u64 {
    expenses.iter().map(|expense| expense.amount).sum()
}

fn totals_by_category(expenses: &[Expense]) -> BTreeMap<String, u64> {
    let mut totals = BTreeMap::new();
    for expense in expenses {
        *totals.entry(expense.category.clone()).or_insert(0) += expense.amount;
    }
    totals
}

fn remaining_budget(budget: u64, expenses: &[Expense]) -> Option<u64> {
    budget.checked_sub(total_expenses(expenses))
}
` +
      expenseMain,
    expectedOutput:
      "Tổng chi: 350000 đ\nCòn lại: 150000 đ\năn uống: 250000 đ\nđi lại: 100000 đ\n",
    accent: "orange",
  },
  {
    id: "text-analyzer",
    title: "Khám phá một đoạn văn",
    description:
      "Xây công cụ phân tích văn bản tiếng Việt: tách từ, đếm tần suất và tìm từ xuất hiện nhiều nhất, có xử lý ký tự Unicode.",
    level: "Trung cấp",
    estimate: "45–60 phút",
    tags: ["String", "Unicode", "Iterator", "BTreeMap"],
    objectives: [
      "Phân biệt độ dài theo byte với số Unicode scalar value mà chars() duyệt qua.",
      "Kết hợp split, filter, map và collect để chuẩn hóa văn bản thành các token.",
      "Xử lý đầu vào rỗng và quy tắc chọn kết quả khi nhiều từ có cùng tần suất.",
    ],
    instructions: [
      "Hoàn thiện tokenize: dùng ký tự không phải chữ cái làm dấu phân cách, bỏ phần rỗng và chuyển mỗi token thành chữ thường. Với bài này, một ‘từ’ là một token chữ cái, không phải phân tích từ ghép tiếng Việt.",
      "Hoàn thiện count_words: tạo BTreeMap<String, usize> chứa số lần xuất hiện của từng token. Không làm mất các chữ có dấu trong dữ liệu mẫu.",
      "Hoàn thiện most_frequent: trả Some((từ, số lần)) của từ xuất hiện nhiều nhất; nếu hòa, chọn từ đứng trước theo thứ tự so sánh chuỗi của Rust. Trả None khi map rỗng.",
      "Giữ các phép kiểm tra có sẵn và in báo cáo mẫu. chars().count() đếm Unicode scalar value; một ký tự hiển thị có thể gồm nhiều scalar value, nên đây chưa phải bộ đếm grapheme tổng quát.",
    ],
    starterCode:
      textPrelude +
      `
fn tokenize(text: &str) -> Vec<String> {
    // TODO: Tách theo ký tự không phải chữ cái và chuyển thành chữ thường.
    todo!("Tách văn bản thành các token")
}

fn count_words(words: &[String]) -> BTreeMap<String, usize> {
    // TODO: Đếm tần suất bằng entry(...).or_insert(...).
    todo!("Đếm số lần xuất hiện")
}

fn most_frequent(counts: &BTreeMap<String, usize>) -> Option<(&str, usize)> {
    // TODO: Xử lý map rỗng và trường hợp đồng hạng.
    todo!("Tìm từ phổ biến nhất")
}
` +
      textMain,
    solutionCode:
      textPrelude +
      `
fn tokenize(text: &str) -> Vec<String> {
    text.split(|character: char| !character.is_alphabetic())
        .filter(|word| !word.is_empty())
        .map(str::to_lowercase)
        .collect()
}

fn count_words(words: &[String]) -> BTreeMap<String, usize> {
    let mut counts = BTreeMap::new();
    for word in words {
        *counts.entry(word.clone()).or_insert(0) += 1;
    }
    counts
}

fn most_frequent(counts: &BTreeMap<String, usize>) -> Option<(&str, usize)> {
    // BTreeMap duyệt từ theo thứ tự tăng dần.
    // Chỉ thay kết quả khi số lần lớn hơn để giữ từ đứng trước khi hòa.
    let mut best: Option<(&str, usize)> = None;
    for (word, &count) in counts {
        match best {
            None => best = Some((word.as_str(), count)),
            Some((_, best_count)) if count > best_count => {
                best = Some((word.as_str(), count));
            }
            _ => {}
        }
    }
    best
}
` +
      textMain,
    expectedOutput:
      "Số từ: 7\nTừ khác nhau: 5\nPhổ biến nhất: rust (3)\nKý tự (Unicode): 33\n",
    accent: "blue",
  },
  {
    id: "task-manager",
    title: "Một ngày có kế hoạch",
    description:
      "Viết lõi của một ứng dụng quản lý công việc: thêm việc, đánh dấu hoàn thành và xem những việc còn lại với lỗi được xử lý rõ ràng.",
    level: "Trung cấp",
    estimate: "60–90 phút",
    tags: ["Struct & impl", "Borrowing", "Result", "Iterator"],
    objectives: [
      "Gói trạng thái và hành vi trong TaskList, dùng &mut self cho thao tác sửa dữ liệu.",
      "Dùng Result để diễn đạt lỗi đầu vào và ID không tồn tại.",
      "Trả về danh sách tham chiếu tới việc chưa hoàn thành, không clone toàn bộ dữ liệu.",
    ],
    instructions: [
      "Hoàn thiện add: trim tên việc; từ chối tên rỗng với Err(\"Tên việc không được để trống\"). ID hợp lệ bắt đầu từ 1 và tăng dần. Yêu cầu không hợp lệ không được tiêu thụ ID.",
      "Hoàn thiện complete: tìm công việc theo ID và đặt done = true. Nếu không tìm thấy, trả Err(\"Không tìm thấy công việc\"). Đánh dấu một việc đã xong vẫn trả Ok(()).",
      "Hoàn thiện pending: trả Vec<&Task> gồm các việc có done = false theo đúng thứ tự được thêm; không thay đổi dữ liệu.",
      "Giữ các kiểm tra trong main cho danh sách rỗng, tên không hợp lệ, ID không tồn tại và việc đã xong. In báo cáo mẫu sau khi hoàn thành công việc đầu tiên.",
      "Dữ liệu của dự án nằm trong bộ nhớ của lần chạy. Đây là phần lõi xử lý công việc; lưu tệp, cơ sở dữ liệu và giao diện là các hướng mở rộng tiếp theo.",
    ],
    starterCode:
      taskPrelude +
      `
impl TaskList {
    fn add(&mut self, title: &str) -> Result<u32, &'static str> {
        // TODO: Kiểm tra tên, tạo ID và thêm một Task chưa hoàn thành.
        todo!("Thêm công việc")
    }

    fn complete(&mut self, id: u32) -> Result<(), &'static str> {
        // TODO: Tìm Task và cập nhật done, hoặc trả lỗi rõ ràng.
        todo!("Hoàn thành công việc")
    }

    fn pending(&self) -> Vec<&Task> {
        // TODO: Lọc các Task chưa hoàn thành.
        todo!("Lấy danh sách việc còn lại")
    }
}
` +
      taskMain,
    solutionCode:
      taskPrelude +
      `
impl TaskList {
    fn add(&mut self, title: &str) -> Result<u32, &'static str> {
        let title = title.trim();
        if title.is_empty() {
            return Err("Tên việc không được để trống");
        }

        self.next_id += 1;
        self.tasks.push(Task {
            id: self.next_id,
            title: title.to_owned(),
            done: false,
        });
        Ok(self.next_id)
    }

    fn complete(&mut self, id: u32) -> Result<(), &'static str> {
        match self.tasks.iter_mut().find(|task| task.id == id) {
            Some(task) => {
                task.done = true;
                Ok(())
            }
            None => Err("Không tìm thấy công việc"),
        }
    }

    fn pending(&self) -> Vec<&Task> {
        self.tasks.iter().filter(|task| !task.done).collect()
    }
}
` +
      taskMain,
    expectedOutput:
      "Công việc: 3\nĐã xong: 1\n[ ] #2 Làm bài tập Vec\n[ ] #3 Viết dự án đầu tay\n",
    accent: "green",
  },
];
