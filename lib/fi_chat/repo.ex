defmodule FiChat.Repo do
  use Ecto.Repo,
    otp_app: :fi_chat,
    adapter: Ecto.Adapters.Postgres
end
