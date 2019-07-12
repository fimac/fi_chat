use Mix.Config

# In this file, we keep production configuration that
# you'll likely want to automate and keep away from
# your version control system.
#
# You should document the content of this
# file or create a script for recreating it, since it's
# kept out of version control and might be hard to recover
# or recreate for your teammates (or yourself later on).
config :fi_chat, FiChatWeb.Endpoint,
  secret_key_base: "7JxBFNmJSsh3vlSJf2V7BqWNxVvn2RQeKLiBDWJAFn0pfpLJs0V6jYwKy/LZ9Vez"

# Configure your database
config :fi_chat, FiChat.Repo,
  username: "postgres",
  password: "postgres",
  database: "fi_chat_prod",
  pool_size: 10
