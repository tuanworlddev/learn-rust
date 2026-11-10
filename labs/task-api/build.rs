fn main() {
    // sqlx::migrate! embeds files; rebuild when a migration is added or changed.
    println!("cargo:rerun-if-changed=migrations");
}
