defmodule FiChatWeb.RoomChannel do
  use FiChatWeb, :channel
  alias FiChatWeb.Presence

  def join("room:lobby", _, socket) do
    send(self(), :after_join)
    {:ok, socket}
  end

  def handle_info(:after_join, socket) do
    # In the javascript module, we will call room.join("room:lobby"), this modules
    # after_join function will call Present.track to start tracking that user's presence
    # in this room. 

    # socket.assigns.user is the users name stored earlier in the UserSockets connect function.
    # then in the map, we can store additional metadata, for example here online at.

    # When a member joins, there may be other people online already, so push socket, is pushing the 
    # current state of who else is online (Presence.list) back to the user via a
    # present_state event, which will be handle back in javascript.
    Presence.track(socket, socket.assigns.user, %{
      online_at: :os.system_time(:milli_seconds)
    })

    push(socket, "presence_state", Presence.list(socket))
    {:noreply, socket}
  end

  # Here we're listening for messages with type "message:new" (which will be sent with Javascript)
  # and broadcast! ing them to everyone connected to the current room, after adding some metadata.

  def handle_in("message:new", message, socket) do
    broadcast!(socket, "message:new", %{
      user: socket.assigns.user,
      body: message,
      timestamp: :os.system_time(:milli_seconds)
    })

    {:noreply, socket}
  end

  def handle_in("user:typing", %{"typing" => typing, "user" => current_user}, socket) do
    Presence.update(socket, "#{current_user}", %{
      userTyping: typing,
      user: current_user,
      online_at: :os.system_time(:milli_seconds)
    })

    {:reply, :ok, socket}
  end
end
