defmodule FiChatWeb.ErrorViewTest do
  use FiChatWeb.ConnCase, async: true

  # Bring render/3 and render_to_string/3 for testing custom views
  import Phoenix.View

  test "renders 404.html" do
    assert render_to_string(FiChatWeb.ErrorView, "404.html", []) == "Not Found"
  end

  test "renders 500.html" do
    assert render_to_string(FiChatWeb.ErrorView, "500.html", []) == "Internal Server Error"
  end
end
